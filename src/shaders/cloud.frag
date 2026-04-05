const float SKY_TINT_STRENGTH=.45;

const vec3 SKY_TOP_COLOR=vec3(.2078,.3608,.6941);
const vec3 SKY_BOTTOM_COLOR=vec3(.3451,.6745,1.);
const vec3 CLOUD_COLOR_BASE=vec3(1.1,1.1,.9);

const float UV_SCALE=1.1;
const float TIME_SPEED=.03;
const float CLOUD_DARKNESS=.5;
const float CLOUD_LIGHTING=.3;
const float CLOUD_COVER=.2;
const float CLOUD_ALPHA=8.;

const mat2 FBM_ROTATION =mat2(-1.6,1.2,-1.2,-1.6);

vec2 hash(vec2 p){
	p=vec2(
		dot(p,vec2(134.1,331.55)),
		dot(p,vec2(369.3,252.3))
	);
	return-1.+2.*fract(sin(p)*43545.23425678);
}

float noise(vec2 p){
	const float K1=.366025404;
	const float K2=.211324865;
	
	vec2 cell=floor(p+(p.x+p.y)*K1);
	vec2 local=p-cell+(cell.x+cell.y)*K2;
	
	vec2 offset=(local.x>local.y)?vec2(1.,0.):vec2(0.,1.);
	vec2 local1=local-offset+K2;
	vec2 local2=local-1.+2.*K2;
	
	vec3 falloff=max(
		.5-vec3(dot(local,local),dot(local1,local1),dot(local2,local2)),
		0.
	);
	
	vec3 gradient=vec3(
		dot(local,hash(cell)),
		dot(local1,hash(cell+offset)),
		dot(local2,hash(cell+1.))
	);
	
	vec3 contribution=falloff*falloff*falloff*falloff*gradient;
	return dot(contribution,vec3(70.));
}

float fbm(vec2 p){
	float sum=0.;
	float amplitude=(sin(iTime*.0001)*.5+.5)*.1;
	
	for(int i=0;i<8;i++){
		sum+=noise(p)*amplitude;
		p=FBM_ROTATION*p;
		amplitude*=.45;
	}
	
	return sum;
}

vec2 getAspectUV(vec2 fragCoord){
	vec2 uv=fragCoord/iResolution.xy;
	uv.x*=iResolution.x/iResolution.y;
	return uv;
}

float accumulateNoise(
	vec2 uv,
	float time,
	float initialWeight,
	float weightDecay,
	int octaves,
	bool useAbs
){
	float sum=0.;
	float weight=initialWeight;
	
	for(int i=0;i<8;i++){
		if(i>=octaves)break;
		
		float n=noise(uv);
		sum+=useAbs?abs(weight*n):weight*n;
		
		uv=FBM_ROTATION*uv+time;
		weight*=weightDecay;
	}
	
	return sum;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
	vec2 screenUV=fragCoord/iResolution.xy;
	vec2 aspectUV=getAspectUV(fragCoord);
	
	float baseTime=iTime*TIME_SPEED;
	float q=fbm(aspectUV*UV_SCALE*.5);
	
	vec2 cloudUV=aspectUV*UV_SCALE-(q-baseTime);
	float r=accumulateNoise(cloudUV,baseTime,.8,.7,8,true);
	
	vec2 densityUV=aspectUV*UV_SCALE-(q-baseTime);
	float f=accumulateNoise(densityUV,baseTime,.7,.6,8,false);
	
	f*=(r+f);
	
	float detailTime0=iTime*TIME_SPEED*2.;
	vec2 detailUV0=aspectUV*UV_SCALE*2.-(q-detailTime0);
	float c=accumulateNoise(detailUV0,detailTime0,.4,.6,7,false);
	
	float detailTime1=iTime*TIME_SPEED*3.;
	vec2 detailUV1=aspectUV*UV_SCALE*3.-(q-detailTime1);
	float c1=accumulateNoise(detailUV1,detailTime1,.4,.6,7,true);
	
	c+=c1;
	
	vec3 skyColor=mix(SKY_BOTTOM_COLOR,SKY_TOP_COLOR,screenUV.y);
	vec3 cloudColor=CLOUD_COLOR_BASE*clamp(
		CLOUD_DARKNESS+CLOUD_LIGHTING*c,
		0.,
		1.
	);
	
	float cloudMask=clamp(CLOUD_COVER+CLOUD_ALPHA*f*r+c,0.,1.);
	
	vec3 result=mix(
		skyColor,
		clamp(SKY_TINT_STRENGTH*skyColor+cloudColor,0.,1.),
		cloudMask
	);
	
	fragColor=vec4(result,1.);
}