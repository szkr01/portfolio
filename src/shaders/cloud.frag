const float tinit = 0.45;
const vec3 color1 = vec3(0.2078, 0.3608, 0.6941);
const vec3 color2 = vec3(0.3451, 0.6745, 1.0);
const float scale = 1.1;
const float speed = 0.03;
const float clouddark = 0.5;
const float cloudlight = 0.3;
const float cloudcover = 0.2;
const float cloudalpha = 8.0;


const mat2 m = mat2(-1.6, 1.2, -1.2, -1.6);

vec2 hash(vec2 p) {
	p = vec2(dot(p, vec2(134.1, 331.55)), dot(p, vec2(369.3, 252.3)));
	return -1.0 + 2.0 * fract(sin(p) * 43545.23425678);
}

float noise(in vec2 p) {
	const float K1 = 0.366025404;
	const float K2 = 0.211324865;
	vec2 i = floor(p + (p.x + p.y) * K1);
	vec2 a = p - i + (i.x + i.y) * K2;
	vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0 * K2;
	vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
	vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
	return dot(n, vec3(70.0));
}

float fbm(vec2 n) {
	float t = 0.0;
	float amplitude = (sin(iTime*0.0001)*0.5 + 0.5)*0.1;
	for (int i = 0; i < 8; i++) {
		t += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.45;
	}
	return t;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 p = fragCoord.xy / iResolution.xy;
	vec2 uv = p * vec2(iResolution.x / iResolution.y, 1.0);
	float time = iTime * speed;
	float q = fbm(uv * scale * 0.5);

	float r = 0.0;
	uv *= scale;
	uv -= q - time;
	float weight = 0.8;
	for (int i = 0; i < 8; i++) {
		r += abs(weight * noise(uv));
		uv = m * uv + time;
		weight *= 0.7;
	}

	float f = 0.0;
	uv = p * vec2(iResolution.x / iResolution.y, 1.0);
	uv *= scale;
	uv -= q - time;
	weight = 0.7;
	for (int i = 0; i < 8; i++) {
		f += weight * noise(uv);
		uv = m * uv + time;
		weight *= 0.6;
	}

	f *= r + f;

	float c = 0.0;
	time = iTime * speed * 2.0;
	uv = p * vec2(iResolution.x / iResolution.y, 1.0);
	uv *= scale * 2.0;
	uv -= q - time;
	weight = 0.4;
	for (int i = 0; i < 7; i++) {
		c += weight * noise(uv);
		uv = m * uv + time;
		weight *= 0.6;
	}

	float c1 = 0.0;
	time = iTime * speed * 3.0;
	uv = p * vec2(iResolution.x / iResolution.y, 1.0);
	uv *= scale * 3.0;
	uv -= q - time;
	weight = 0.4;
	for (int i = 0; i < 7; i++) {
		c1 += abs(weight * noise(uv));
		uv = m * uv + time;
		weight *= 0.6;
	}

	c += c1;

	vec3 skycolour = mix(color2, color1, p.y);
	vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight * c), 0.0, 1.0);

	f = cloudcover + cloudalpha * f * r;

	vec3 result = mix(
		skycolour,
		clamp(tinit * skycolour + cloudcolour, 0.0, 1.0),
		clamp(f + c, 0.0, 1.0)
	);

	fragColor = vec4(result, 1.0);
}
