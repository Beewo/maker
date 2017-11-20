# basic components
camera = new THREE.PerspectiveCamera 75, window.innerWidth / window.innerHeight, 0.1, 1000
renderer = new THREE.WebGLRenderer antialias: true, alpha: true

scene = new THREE.Scene()
clock = new THREE.Clock()
mouse = new THREE.Vector2()

#ui vars
sidebarShown = false
#drone structure
props = []
modules = []

# scene objects list
objects = []
selection = null
selectionMesh = null
selectionMaterial = new THREE.MeshBasicMaterial { color: 0xffffff, wireframe: true }
raycaster = new THREE.Raycaster()
projector = new THREE.Projector()

renderer.setPixelRatio window.devicePixelRatio
renderer.setSize window.innerWidth, window.innerHeight
renderer.setClearColor 0xffffff, 1.0
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
directionalLight = new THREE.DirectionalLight( 0xffffff, 2, 100 )
directionalLight.position.set 1, 1, 1
directionalLight.castShadow = true

scene.add directionalLight

# fog
scene.fog = new THREE.Fog(0xc1e4e8, 0.015, 100);

# resizable 3d view
tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) )
windowHeight = window.innerHeight

window.addEventListener "resize", (event) => this.onWindowResize(event)

this.onWindowResize = (event) ->
    camera.aspect = window.innerWidth / window.innerHeight
    camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) )
    camera.updateProjectionMatrix()
    camera.lookAt( scene.position )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.render( scene, camera )

#STL loader
loader = new THREE.STLLoader()
loader.crossOrigin = ''

addCore = ->
  loader.load "models/core.stl", (geometry) ->
    mat = new THREE.MeshStandardMaterial({color: 0xfcde00})
    core = new THREE.Mesh(geometry, mat)
    core.rotation.x = -0.5 * Math.PI
    core.rotation.z = Math.PI/6
    core.scale.set(0.1, 0.1, 0.1)
    scene.add(core)
    objects.push core
    core.position.set(0,1,0)

addCore()

render = ->
  requestAnimationFrame render
  renderer.render scene, camera

render()

document.getElementById('add4props').addEventListener "mousedown", (event) ->
  disableButton(4)
  clearProps()
  clearModules()
  addSymmetricProps(2, 0, 60)
  addSymmetricProps(1, 60)
  addSymmetricProps(1, 240)

document.getElementById('add3props').addEventListener "mousedown", (event) ->
  disableButton(3)
  clearProps()
  clearModules()
  addSymmetricProps(3)

document.getElementById('add6props').addEventListener "mousedown", (event) ->
  disableButton(6)
  clearProps()
  clearModules()
  addSymmetricProps(6)


document.getElementById('add-random').addEventListener "mousedown", (event) ->
  addrandomModule()

disableButton = (n) ->
  $('#add4props').prop 'disabled', false
  $('#add3props').prop 'disabled', false
  $('#add6props').prop 'disabled', false
  $('#add'+n+'props').prop 'disabled', true

clearProps = ->
  i = 0
  while i < props.length
    index = scene.children.indexOf props[i]
    scene.remove scene.children[index]

    index = objects.indexOf props[i]
    objects.splice index, 1
    i++
  props = []

clearModules = ->
  i = 0
  while i < modules.length
    index = scene.children.indexOf modules[i]
    scene.remove scene.children[index]

    index = objects.indexOf modules[i]
    objects.splice index, 1
    i++
  modules = []

addrandomModule = () ->  
  loader.load "models/testmodule.stl", (geometry) ->
    console.log(modules.length)

    angle = -30
    position = -10
    position_x = 0
    num_modules = 3

    if props.length == 3
      angle = -30
      position = -10
      num_modules = 3
    else if props.length == 6
      angle = 30
      position = -20
      num_modules = 6
    else
      num_modules = 2
      position = -10
      position_x = 20

    if modules.length >= num_modules
      alert "You can only add upto " + num_modules + " modules when using " + props.length + " props"
    else
      mat = new THREE.MeshStandardMaterial({color: 0xfcde00})
      group = new THREE.Mesh(geometry, mat)
      group.scale.set(0.1, 0.1, 0.1)
      group.rotation.x = -0.5 * Math.PI

      group.rotation.z = angle / 180 * Math.PI
      group.position.set(position_x,1,position)

      pivot = new THREE.Object3D()
      pivot.rotation.y = (360/(num_modules)*(modules.length+1)) / 180 * Math.PI
      pivot.add( group )    
      scene.add( pivot )
      modules.push pivot
      objects.push group

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
      props.push pivot
      objects.push group

renderer.domElement.addEventListener 'mousedown', (event) ->
  event.preventDefault()
  mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  raycaster.setFromCamera mouse, camera
  intersects = raycaster.intersectObjects(objects)
  if intersects.length > 0
    if selection != null
      selection.remove selectionMesh
    selection = intersects[0].object
    # highlight
    selectionMesh = new THREE.Mesh( selection.geometry, selectionMaterial )
    selectionMesh.position = selection.position
    selection.add selectionMesh
  else
    if selection != null
      selection.remove selectionMesh
      selection = null

toggleSidebar = (name) ->
  $( "#show-" + name + "-sidebar" ).click ->
    if sidebarShown
      sidebarShown = false
      $( "#" + name + "-sidebar" ).animate {
        right: "-20%"
      }, { duration: 500, queue:false }, ->
      $( "#show-" + name + "-sidebar" ).animate {
        right: 0
      }, { duration: 500, queue:false }, ->
    else
      sidebarShown = true
      $( "#" + name + "-sidebar" ).animate {
        right: 0
      }, { duration: 500, queue:false }, ->
      $( "#show-" + name + "-sidebar" ).animate {
        right: "20%"
      }, { duration: 500, queue:false }, ->

toggleSidebar('props')
toggleSidebar('extras')
