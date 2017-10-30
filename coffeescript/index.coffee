# basic components
camera = new THREE.PerspectiveCamera 75, window.innerWidth / window.innerHeight, 0.1, 1000
renderer = new THREE.WebGLRenderer antialias: true, alpha: true
scene = new THREE.Scene()
clock = new THREE.Clock()
mouse = new THREE.Vector2()

# scene objects list
objects = []
selection = null
selectionMesh = null
selectionMaterial = new THREE.MeshBasicMaterial { color: 0xff0000, side: THREE.BackSide }
raycaster = new THREE.Raycaster()
projector = new THREE.Projector()

renderer.setPixelRatio window.devicePixelRatio
renderer.setSize window.innerWidth, window.innerHeight
renderer.setClearColor 0x3d3d3d, 1.0
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
$('#editor').append renderer.domElement

# camera
camera.position.z = 15
camera.lookAt new THREE.Vector3 0, 0, 0
scene.add camera

# orbit, pan, zoom controls
controls = new THREE.OrbitControls camera, renderer.domElement
controls.enableZoom = true
controls.addEventListener 'change', -> render

# lightning
directionalLight = new THREE.DirectionalLight( 0xffffff, 1, 100 )
directionalLight.position.set 1, 1, 1
directionalLight.castShadow = true

scene.add directionalLight

#STL loader
loader = new THREE.STLLoader()
loader.crossOrigin = ''
loader.load "models/core.stl", (geometry) ->
  mat = new THREE.MeshStandardMaterial({color: 0xfcde00})
  group = new THREE.Mesh(geometry, mat)
  group.rotation.x = -0.5 * Math.PI
  group.rotation.z = Math.PI/6
  group.scale.set(0.1, 0.1, 0.1)
  scene.add(group)
  objects.push group
  group.position.set(0,1,0)

render = ->
  requestAnimationFrame render
  renderer.render scene, camera

render()

document.getElementById('add4props').addEventListener "mousedown", (event) ->
  addSymmetricProps(2, 0, 60)
  addSymmetricProps(1, 60)
  addSymmetricProps(1, 240)

document.getElementById('add3props').addEventListener "mousedown", (event) ->
  addSymmetricProps(3)

document.getElementById('add6props').addEventListener "mousedown", (event) ->
  addSymmetricProps(6)

addSymmetricProps = (num, offset, rotateTo) ->
  offset ?= 0
  rotateTo ?= 0
  loader.load "models/prop.stl", (geometry) ->
    mat = new THREE.MeshStandardMaterial({color: 0xfcde00})
    i = 1
    while i <= num
      group = new THREE.Mesh(geometry, mat)
      group.scale.set(0.1, 0.1, 0.1)
      group.rotation.x = -0.5 * Math.PI
      group.rotation.z = Math.PI/6 + rotateTo*Math.PI/180
      group.position.set(16.5,1,0)
      pivot = new THREE.Object3D()
      pivot.add( group )
      pivot.rotation.y = (360/num + offset) / 180 * Math.PI * i++
      scene.add( pivot )

renderer.domElement.addEventListener 'mousedown', (event) ->
  event.preventDefault()
  mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  raycaster.setFromCamera mouse, camera
  intersects = raycaster.intersectObjects(objects)
  console.log(objects)
  console.log(intersects)
  if intersects.length > 0
    selection = intersects[0].object

    # highlight
    selectionMesh = new THREE.Mesh( selection.geometry, selectionMaterial )
    selectionMesh.position = selection.position
    selectionMesh.scale.multiplyScalar(1.05)
    selection.add selectionMesh
  else
    if selection != null
      selection.remove selectionMesh
      selection = null
