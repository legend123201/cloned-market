/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// images
import ImgSpace from '../space.jpg';
import ImgMoon from '../moon.jpg';
import ImgNormal from '../normal.jpg';

// gltf files
// @ts-ignore
import GltfSpaceship from '../Modal/2CylinderEngine.gltf';
// @ts-ignore
import RocketShip from '../Modal/rocket_ship/scene.gltf';

const ThreeJsFunctions = () => {
	const initScene = (): THREE.Scene => {
		return new THREE.Scene();
	};

	const initCamera = (): THREE.Camera => {
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			200
		);

		camera.position.set(60, 32, -4);
		return camera;
	};

	const initRenderer = (): THREE.WebGLRenderer => {
		const renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('#bg') as HTMLCanvasElement,
		});

		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		return renderer;
	};

	// return an array of objects at postition2D
	const intersect = (
		position2D: THREE.Vector2,
		scene: THREE.Scene,
		camera: THREE.Camera
	): THREE.Intersection<THREE.Object3D<THREE.Event>>[] => {
		const raycaster = new THREE.Raycaster();

		raycaster.setFromCamera(position2D, camera);
		return raycaster.intersectObjects(scene.children);
	};

	// return a point in 3D on a sphere surface
	// -1 <= theta <= 1
	// -180 <= phi <= 180
	const position3DOnSphere = (radius: number, theta: number, phi: number): THREE.Vector3 => {
		let vertex = new THREE.Vector3();

		// const theta = THREE.Math.randFloatSpread(360);
		// const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
		// const phi = THREE.MathUtils.randFloatSpread(360);

		vertex.x = radius * Math.sin(theta) * Math.cos(phi);
		vertex.y = radius * Math.sin(theta) * Math.sin(phi);
		vertex.z = radius * Math.cos(theta);

		return vertex;
	};

	const createPointLight = (scene: THREE.Scene): void => {
		const pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(15, 15, 15);
		scene.add(pointLight);

		// lightHelper
		const lightHelper = new THREE.PointLightHelper(pointLight);
		scene.add(lightHelper);
	};

	const createAmbientLight = (scene: THREE.Scene): void => {
		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);
	};

	const createAxesHelper = (scene: THREE.Scene): void => {
		const axesHelper = new THREE.AxesHelper(50);
		scene.add(axesHelper);
	};

	const createGridHelper = (scene: THREE.Scene): void => {
		const gridHelper = new THREE.GridHelper(200, 50);
		scene.add(gridHelper);
	};

	const createSceneBackground = (scene: THREE.Scene): void => {
		const spaceTexture = new THREE.TextureLoader().load(ImgSpace);
		scene.background = spaceTexture;
	};

	const createStarsObj = (scene: THREE.Scene): void => {
		function addStar() {
			const geometry = new THREE.SphereGeometry(0.25, 24, 24);
			const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
			const star = new THREE.Mesh(geometry, material);

			const [x, y, z] = Array(3)
				.fill(null)
				.map(() => THREE.MathUtils.randFloatSpread(100));

			star.position.set(x, y, z);
			scene.add(star);
		}

		Array(200).fill(null).forEach(addStar);
	};

	const createMoonObj = (): THREE.Mesh => {
		const moonTexture = new THREE.TextureLoader().load(ImgMoon);
		const normalTexture = new THREE.TextureLoader().load(ImgNormal);

		const geometry = new THREE.SphereGeometry(5, 32, 32);
		const material = new THREE.MeshStandardMaterial({
			map: moonTexture,
			normalMap: normalTexture,
		});

		const moon = new THREE.Mesh(geometry, material);

		const position = position3DOnSphere(40, 1, 180);
		moon.position.set(position.x, position.y, position.z);

		moon.userData = {
			name: 'moon',
			clickable: true,
		};

		return moon;
	};

	const createTorusObj = (): THREE.Mesh => {
		const torusTexture = new THREE.TextureLoader().load(ImgMoon);
		const normalTexture = new THREE.TextureLoader().load(ImgNormal);

		const geometry = new THREE.TorusGeometry(15, 1, 16, 100);
		const material = new THREE.MeshStandardMaterial({
			color: 0xff6347,
			map: torusTexture,
			normalMap: normalTexture,
		});

		const torus = new THREE.Mesh(geometry, material);

		torus.rotation.x = -1.2;
		const position = position3DOnSphere(40, 1, 180);
		torus.position.set(position.x, position.y, position.z);

		torus.userData = {
			name: 'torus',
			clickable: true,
		};

		return torus;
	};

	const createPlanet1Obj = (): THREE.Mesh => {
		const torusTexture = new THREE.TextureLoader().load(ImgMoon);
		const normalTexture = new THREE.TextureLoader().load(ImgNormal);

		const geometry = new THREE.SphereGeometry(8, 10, 10);
		const material = new THREE.MeshStandardMaterial({
			color: 0xffff00,
			map: torusTexture,
			normalMap: normalTexture,
		});
		const sphere = new THREE.Mesh(geometry, material);

		const position = position3DOnSphere(40, -1, -180);
		sphere.position.set(position.x, position.y, position.z);

		sphere.userData = {
			name: 'planet1',
			clickable: true,
		};

		return sphere;
	};

	const createPlanet2Obj = (): THREE.Mesh => {
		const torusTexture = new THREE.TextureLoader().load(ImgMoon);
		const normalTexture = new THREE.TextureLoader().load(ImgNormal);

		const geometry = new THREE.TorusKnotGeometry(5, 3, 100, 16);
		const material = new THREE.MeshStandardMaterial({
			color: '#32a852',
			map: torusTexture,
			normalMap: normalTexture,
		});

		const torusKnot = new THREE.Mesh(geometry, material);

		const position = position3DOnSphere(40, 1, -60);
		torusKnot.position.set(position.x, position.y, position.z);

		torusKnot.userData = {
			name: 'planet2',
			clickable: true,
		};

		return torusKnot;
	};

	const importSpaceship = async (): Promise<THREE.Group | null> => {
		// Instantiate a loader
		const loader = new GLTFLoader();
		const textureLoader = new THREE.TextureLoader();
		let object: THREE.Group | null = null;

		try {
			// Load a glTF resource
			const gltf: GLTF = await loader.loadAsync('./assets/sci-fi_spaceship/scene.gltf');
			object = gltf.scene;

			object.traverse((o: any) => {
				if (o.isMesh) {
					o.material = new THREE.MeshBasicMaterial({
						map: textureLoader.load(
							'./assets/sci-fi_spaceship/textures/Default.001_normal.png'
						),
					});
				}
			});

			console.log('object', object);
			console.log('gltf', gltf);

			object.scale.set(10, 10, 10);

			object.userData = {
				name: 'spaceship',
				clickable: false,
			};
		} catch (error) {
			console.log(error);
		}

		return object;
	};

	return {
		initScene,
		initCamera,
		initRenderer,
		intersect,
		position3DOnSphere,
		createPointLight,
		createAmbientLight,
		createAxesHelper,
		createGridHelper,
		createSceneBackground,
		createStarsObj,
		createMoonObj,
		createTorusObj,
		createPlanet1Obj,
		createPlanet2Obj,
		importSpaceship,
	};
};
export default ThreeJsFunctions;
