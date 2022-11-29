import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'lil-gui'
import testFragmentShader from './shaders/planets/oneFragment.glsl'
import testVertexShader from './shaders/planets/oneVertex.glsl'



/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axis helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const chromeMatcapTexture = textureLoader.load('/textures/matcaps/3.png')
const matcapTextureDonut = textureLoader.load('/textures/matcaps/8.png')
const matcapTextureToon = textureLoader.load('/textures/matcaps/7.png')
const matcapTextureGore = textureLoader.load('/textures/matcaps/5.png')
const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const textures = [matcapTextureDonut, matcapTextureGore]

const getRandTexture = textures => {
    return textures[Math.floor(Math.random() * 2)]
}


/**
 * Fonts
 */
const fonts = {
    helBold: './fonts/helvetiker_bold.typeface.json',
    helReg: './fonts/helvetiker_regular.typeface.json',
    genReg: './fonts/gentilis_regular.typeface.json',
    genBold: './fonts/gentilis_bold.typeface.json',
    optReg: './fonts/optimer_regular.typeface.json',
    optBold: './fonts/optimer_bold.typeface.json',
    droidSerif: './fonts/droid/droid_serif_regular.typeface.json',
    dosis: './fonts/dosis/Dosis_Regular.json'
}
const fontLoader = new FontLoader()

fontLoader.load(
    fonts.dosis,
    (font) => {
        const textGeometry = new TextGeometry(
            '0xjosiah',
            {
                font,
                size: .5,
                height: .2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - .02) * .5,
        //     - (textGeometry.boundingBox.max.y - .02) * .5,
        //     - (textGeometry.boundingBox.max.z - .03) * .5
        // )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial({ matcap: chromeMatcapTexture })
        // material.wireframe = true
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(.3, .2, 20, 45)
        const octaGeometry = new THREE.OctahedronGeometry(.01, 0)
        
        for(let i = 0; i < 1000; i++) {
            const donutMaterial = new THREE.MeshMatcapMaterial({ 
                // matcap: getRandTexture(textures)
                matcap: chromeMatcapTexture
            })
            const donut = new THREE.Mesh(octaGeometry, donutMaterial)

            donut.position.set(
                (Math.random() - .5) * 15,
                (Math.random() - .5) * 15,
                (Math.random() - .5) * 15
            )

            donut.rotation.x = Math.random() * Math.PI

            const randScale = Math.random()
            donut.scale.set(randScale, randScale, randScale)

            scene.add(donut)
        }
    }
)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Test planet
 */
const initPlanet = () => {
    // Geometry
    const geometry = new THREE.SphereGeometry(.5)

    // Material
    const material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: { value: 0 }
        }
    })

    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
}
initPlanet()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 1
controls.maxDistance = 6

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = Math.sin(elapsedTime)

    // Rotate shapes
    // donut.rotation.x = Math.random() * Math.PI


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()