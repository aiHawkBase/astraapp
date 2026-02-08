window.Cosmos = {
    scene: null,
    camera: null,
    renderer: null,
    stars: null,
    sun: null,
    controls: null,
    speed: 0.2,
    targetSpeed: 0.2,
    rafId: null,

    init: function () {
        // Scene setup
        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x050510, 0.002);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('cosmos-canvas'),
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Controls
        // Assumes OrbitControls is loaded from CDN
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.5;
        }

        this.createStars();
        this.createSun();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize(), false);
    },

    createStars: function () {
        const geometry = new THREE.BufferGeometry();
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = 800; // Radius
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Random colors (blue/white/gold)
            const colorType = Math.random();
            const color = new THREE.Color();
            if (colorType > 0.9) color.setHex(0xffd700); // Gold
            else if (colorType > 0.6) color.setHex(0xaaaaaa); // White
            else color.setHex(0x5555ff); // Blue

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            map: this.createStarTexture(),
            transparent: true,
            alphaTest: 0.5
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    },

    createStarTexture: function () {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    },

    createSun: function () {
        // The "Mascot" - A glowing orb
        const geometry = new THREE.SphereGeometry(2, 32, 32);

        // Shader Material for Glow
        const vertexShader = `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fragmentShader = `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity + vec4(0.1, 0.2, 0.5, 0.3);
            }
        `;

        // Inner Core
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xaaddff });
        this.sun = new THREE.Mesh(geometry, coreMat);

        // Glow Halo
        const glowGeo = new THREE.SphereGeometry(3.5, 32, 32);
        const glowMat = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        this.sun.add(glowMesh);

        // Add Light
        const light = new THREE.PointLight(0x4444ff, 2, 100);
        this.sun.add(light);

        // Position it off-center initially
        this.sun.position.set(10, 5, 0);

        this.scene.add(this.sun);
    },

    setSpeed: function (val) {
        this.targetSpeed = val;
    },

    animate: function () {
        requestAnimationFrame(() => this.animate());

        // Lerp speed for smooth transition
        this.speed += (this.targetSpeed - this.speed) * 0.05;

        // Rotate scene/stars
        if (this.stars) {
            this.stars.rotation.y += 0.001 * this.speed;
            this.stars.rotation.x += 0.0005 * this.speed;
        }

        // Float sun
        if (this.sun) {
            const time = Date.now() * 0.001;
            this.sun.position.y += Math.sin(time) * 0.02;
            this.sun.rotation.y += 0.01;
        }

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    },

    onWindowResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
};
