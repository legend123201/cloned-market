/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// styled
import { Wrapper } from './styled';

import ThreeJsFunctions from './ThreejsFunctions';
import { Box, Typography } from '@mui/material';
const {
	initScene,
	initCamera,
	initRenderer,
	intersect,
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
} = ThreeJsFunctions();
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'model-viewer': React.DetailedHTMLProps<any, any>;
		}
	}
}

export default function App() {
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const scene: THREE.Scene = initScene();
			const camera: THREE.Camera = initCamera();
			const renderer: THREE.WebGLRenderer = initRenderer();

			// OBJECTS
			createSceneBackground(scene);

			const moon: THREE.Mesh = createMoonObj();
			scene.add(moon);

			const torus: THREE.Mesh = createTorusObj();
			scene.add(torus);

			const planet1 = createPlanet1Obj();
			scene.add(planet1);

			const planet2 = createPlanet2Obj();
			scene.add(planet2);

			createStarsObj(scene);

			const spaceship: THREE.Group | null = await importSpaceship();
			if (spaceship) scene.add(spaceship);

			// LIGHT AND GRID
			createPointLight(scene);
			createAmbientLight(scene);
			createAxesHelper(scene);
			// createGridHelper(scene);

			// control helper
			const controls = new OrbitControls(camera, renderer.domElement);
			controls.update(); //controls.update() must be called after any manual changes to the camera's transform

			// RAYCASTER
			const clickMouse = new THREE.Vector2(); // create once
			const moveMouse = new THREE.Vector2(); // create once
			let selectedObject: THREE.Object3D;

			window.addEventListener('mousemove', (event) => {
				moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			});

			window.addEventListener('keydown', (event) => {
				if (event.key === 'Escape') {
					// Do whatever when esc is pressed
					gsap.to(camera.position, {
						duration: 2.5,
						x: 60,
						y: 32,
						z: -4,
						ease: 'slow(0.7, 0.7, false)',
					});
				}

				if (event.key === '1') {
					console.log(camera.position);
				}

				if (event.key === '2') {
					if (spaceship) console.log(spaceship.position);
				}

				if (event.key === '3') {
					console.log(moon.position);
				}

				if (event.key === '4') {
					console.log(planet1.position);
				}

				if (event.key === '5') {
					console.log(planet2.position);
				}
			});

			window.addEventListener('click', (event) => {
				// if (selectedObject != null) {
				// 	console.log(`dropping selectedObject ${selectedObject.userData.name}`);
				// 	selectedObject = null as any;
				// 	return;
				// }

				clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

				const found = intersect(clickMouse, scene, camera);

				if (found.length > 0) {
					let current = found[0].object;

					while (current.parent?.parent !== null) {
						current = current.parent!;
					}

					if (current.userData.clickable) {
						selectedObject = current;
						console.log(`found selectedObject ${selectedObject.userData.name}`);

						if (spaceship) {
							gsap.to(spaceship.position, {
								duration: 2.5,
								x: selectedObject.position.x,
								y: selectedObject.position.y,
								z: selectedObject.position.z,
								ease: 'slow(0.7, 0.7, false)',
							});

							gsap.to(camera.position, {
								duration: 2.5,
								x:
									selectedObject.position.x < 0
										? selectedObject.position.x -
										  Math.abs(selectedObject.position.x)
										: selectedObject.position.x +
										  Math.abs(selectedObject.position.x),
								y:
									selectedObject.position.y < 0
										? selectedObject.position.y -
										  Math.abs(selectedObject.position.y)
										: selectedObject.position.y +
										  Math.abs(selectedObject.position.y),
								z:
									selectedObject.position.z < 0
										? selectedObject.position.z -
										  Math.abs(selectedObject.position.z)
										: selectedObject.position.z +
										  Math.abs(selectedObject.position.z),
								ease: 'slow(0.7, 0.7, false)',
							});
						}
					}
				}
			});

			function dragObject() {
				if (selectedObject != null) {
					const found = intersect(moveMouse, scene, camera);
					if (found.length > 0) {
						for (let i = 0; i < found.length; i++) {
							// if (!found[i].object.userData.ground) continue;

							let target = found[i].point;
							selectedObject.position.x = target.x;
							selectedObject.position.z = target.z;
						}
					}
				}
			}

			function animate() {
				torus.rotation.z += 0.01;
				moon.rotation.y += 0.01;
				planet1.rotation.z += 0.001;
				planet1.rotation.y -= 0.001;
				planet2.rotation.x -= 0.001;
				planet2.rotation.z += 0.001;

				// dragObject();
				controls.update();
				renderer.render(scene, camera);
				requestAnimationFrame(animate);
			}

			animate();
		})();
	}, []);

	/*useEffect(() => {
		// create scene
		var scene = new THREE.Scene();

		// add event scroll
		document.addEventListener('mousemove', onMouseMove, false);

		// create camera
		var camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		var mouseX;
		var mouseY;

		var renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('#bg') as HTMLCanvasElement,
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		// document.body.appendChild(renderer.domElement);

		// ================================================= LIGHT
		// point light
		const pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(5, 5, 5);
		scene.add(pointLight);

		// ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		// background
		const spaceTexture = new THREE.TextureLoader().load(ImgSpace);
		scene.background = spaceTexture;

		// light helper
		const lightHelper = new THREE.PointLightHelper(pointLight);
		const gridHelper = new THREE.GridHelper(200, 50);
		scene.add(lightHelper, gridHelper);

		// control helper
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.update(); //controls.update() must be called after any manual changes to the camera's transform

		window.addEventListener('resize', function () {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});

		var distance = Math.min(80, window.innerWidth / 4);
		var geometry = new THREE.BufferGeometry();

		var arrVector = [];
		for (var i = 0; i < 1600; i++) {
			var vertex = new THREE.Vector3();

			// var theta = THREE.Math.randFloatSpread(360);
			var theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
			var phi = THREE.MathUtils.randFloatSpread(360);

			vertex.x = distance * Math.sin(theta) * Math.cos(phi);
			vertex.y = distance * Math.sin(theta) * Math.sin(phi);
			vertex.z = distance * Math.cos(theta);

			// geometry.vertices.push(vertex);
			arrVector.push(vertex);
		}

		geometry.setFromPoints(arrVector);
		geometry.computeVertexNormals();

		var particles = new THREE.Points(
			geometry,
			new THREE.PointsMaterial({ color: 0xff44ff, size: 2 })
		);

		// particles.boundingSphere = 50;

		var renderingParent = new THREE.Group();
		renderingParent.add(particles);

		var resizeContainer = new THREE.Group();
		resizeContainer.add(renderingParent);
		scene.add(resizeContainer);

		camera.position.z = 400;

		var animate = function () {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		var myTween: any;
		function onMouseMove(event: any) {
			if (myTween) myTween.kill();

			mouseX = (event.clientX / window.innerWidth) * 2 - 1;
			mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
			myTween = gsap.to(particles.rotation, { duration: 0.1, x: mouseY * -1, y: mouseX });
			//particles.rotation.x = mouseY*-1;
			//particles.rotation.y = mouseX;
		}
		animate();

		// Scaling animation
		var animProps = { scale: 1, xRot: 0, yRot: 0 };
		gsap.to(animProps, {
			duration: 1,
			scale: 1.3,
			repeat: -1,
			yoyo: true,
			ease: 'sine',
			onUpdate: function () {
				renderingParent.scale.set(animProps.scale, animProps.scale, animProps.scale);
			},
		});

		gsap.to(animProps, {
			duration: 12,
			xRot: Math.PI * 2,
			yRot: Math.PI * 4,
			repeat: -1,
			yoyo: true,
			ease: 'none',
			onUpdate: function () {
				renderingParent.rotation.set(animProps.xRot, animProps.yRot, 0);
			},
		});
	}, []);*/

	return (
		<Wrapper>
			<canvas id="bg"></canvas>
			<Box
				sx={{
					position: 'fixed',
					top: 10,
					left: 10,
					padding: 1,
					background: 'black',
					width: '300px',
					zIndex: 999999999999,
					border: '1px solid white',
				}}
			>
				<Typography variant="body1">- Escape: return to default camera.</Typography>
				<Typography variant="body1">- 1: Show position of camera.</Typography>
				<Typography variant="body1">- 2: Show position of spaceship.</Typography>
				<Typography variant="body1">- 3: Show position of moon.</Typography>
				<Typography variant="body1">- 4: Show position of planet yellow.</Typography>
				<Typography variant="body1">- 5: Show position of plannet green.</Typography>
				<Typography variant="body1">=============================</Typography>
				<Typography variant="body1">- Axes:</Typography>
				<Typography variant="body1">+ Green line: axes Y.</Typography>
				<Typography variant="body1">+ Red line: axes X.</Typography>
				<Typography variant="body1">+ Blue line: axes Z.</Typography>
				<Typography variant="body1">- 1 block of grid helper equal to 4x4.</Typography>
			</Box>
		</Wrapper>
	);
}
