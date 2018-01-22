# basic components
camera = new THREE.PerspectiveCamera 75, window.innerWidth / window.innerHeight, 0.1, 1000
renderer = new THREE.WebGLRenderer antialias: true, alpha: true

scene = new THREE.Scene()
clock = new THREE.Clock()
mouse = new THREE.Vector2()

# ui vars
sidebarShown = false

# drone structure
props            = []
propMode         = 0
moduleMode       = 0
custom_modules   = []
cam_modules      = []
ir_modules       = []
prompted_modules = []

# scene objects list
objects = []
selection = null
arrow = null
arrow_module = null

selectionMaterial = new THREE.MeshStandardMaterial { color: 0x40e0d0 }
mat = new THREE.MeshStandardMaterial {color: 0xfcde00}
arduino_mat = new THREE.MeshStandardMaterial {color: 0x3f6f70}
promptedMaterial = new THREE.MeshStandardMaterial {color: 0x888888, transparent: true, opacity: 0.6}

raycaster = new THREE.Raycaster()
projector = new THREE.Projector()

renderer.setPixelRatio window.devicePixelRatio
renderer.setSize window.innerWidth, window.innerHeight
renderer.autoClear = false
renderer.setClearColor 0xffffff, 0.0
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
directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6, 100 )
directionalLight.position.set 0, 10, 0
directionalLight.castShadow = true

scene.add directionalLight

light = new THREE.AmbientLight( 0xffffff, 1.2 )
light.position.set 5, 1, 1
light.castShadow = true

scene.add light

# fog
scene.fog = new THREE.Fog(0xc1e4e8, 0.015, 400);

# resizable 3d view
tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) )
windowHeight = window.innerHeight


window.addEventListener "mousemove",(event) -> this.onMouseMove(event)

window.addEventListener "resize", (event) -> this.onWindowResize(event)

this.onWindowResize = (event) ->
    camera.aspect = window.innerWidth / window.innerHeight
    camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) )
    camera.updateProjectionMatrix()
    camera.lookAt( scene.position )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.render( scene, camera )

this.onMouseMove = (event) ->

    mouse.x = ( event.clientX / window.innerWidth ) * 2 -1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1.15;
    #console.log(mouse.x+" "+mouse.y)



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
  raycaster.setFromCamera mouse, camera

render()

document.getElementById('add4props').addEventListener "mousedown", (event) ->
  enableStep2()
  disableButton(4)
  clearProps()
  clearModules()
  clearPromptedModules()
  addSymmetricProps(2, 0, 60)
  addSymmetricProps(1, 60)
  addSymmetricProps(1, 240)

document.getElementById('add3props').addEventListener "mousedown", (event) ->
  enableStep2()
  disableButton(3)
  clearProps()
  clearModules()
  clearPromptedModules()
  addSymmetricProps(3)

document.getElementById('add6props').addEventListener "mousedown", (event) ->
  enableStep2()
  disableButton(6)
  clearProps()
  clearModules()
  clearPromptedModules()
  addSymmetricProps(6)

document.getElementById('add-camera').addEventListener "mousedown", (event) ->
  clearPromptedModules()
  moduleMode       = 1
  promptModuleSlots("models/cameramodule.stl")

document.getElementById('add-ir').addEventListener "mousedown", (event) ->
  clearPromptedModules()
  moduleMode       = 2
  promptModuleSlots("models/irmodule.stl")

document.getElementById('add-random').addEventListener "mousedown", (event) ->
  clearPromptedModules()
  moduleMode       = 3
  promptModuleSlots("models/testmodule.stl")

document.getElementById('save').addEventListener "mousedown", (event) ->
  saveDrone()

$("#load-input").change () ->
  loadDrone this.files[0]


disableButton = (n) ->
  $('#add4props').prop 'disabled', false
  $('#add3props').prop 'disabled', false
  $('#add6props').prop 'disabled', false
  $('#add'+n+'props').prop 'disabled', true

enableStep2 = () ->
  $('#add-random').prop 'disabled', false
  $('#add-ir').prop     'disabled', false
  $('#add-camera').prop 'disabled', false

clearProps = ->
  i = 0
  while i < props.length
    index = scene.children.indexOf props[i].parent
    scene.remove scene.children[index]

    index = objects.indexOf props[i]
    objects.splice index, 1
    i++
  props = []

clearModules = ->
  i = 0
  while i < cam_modules.length
    index = scene.children.indexOf cam_modules[i].parent
    scene.remove scene.children[index]

    index = objects.indexOf cam_modules[i]
    alert(index)
    objects.splice index, 1
    i++
  cam_modules = []

  i = 0
  while i < ir_modules.length
    index = scene.children.indexOf ir_modules[i].parent
    scene.remove scene.children[index]

    index = objects.indexOf ir_modules[i]
    alert(index)
    objects.splice index, 1
    i++
  ir_modules = []

  i = 0
  while i < custom_modules.length
    index = scene.children.indexOf custom_modules[i].parent
    scene.remove scene.children[index]

    index = objects.indexOf custom_modules[i]
    objects.splice index, 1
    i++
  custom_modules = []

clearPromptedModules = ->
  i = 0
  while i < prompted_modules.length
    index = scene.children.indexOf prompted_modules[i].parent
    scene.remove scene.children[index]

    index = objects.indexOf prompted_modules[i]
    objects.splice index, 1
    i++
  prompted_modules = []

promptModuleSlots = (model) ->
  loader.load model, (geometry) ->
    angle = -30
    position = -10
    position_x = 0

    if propMode == 3
      position_x = 4
      angle = -30
      position = -12
      num_modules = 3
    else if propMode == 6
      angle = 30
      position = -24
      num_modules = 6
    else
      num_modules = 2
      position = -12
      position_x = 21

    while prompted_modules.length < num_modules
      group = new THREE.Mesh(geometry, promptedMaterial)
      group.scale.set(0.1, 0.1, 0.1)
      group.rotation.x = -0.5 * Math.PI

      group.rotation.z = angle / 180 * Math.PI
      group.position.set(position_x,1,position)

      pivot = new THREE.Object3D()
      pivot.rotation.y = (360/(num_modules)*(prompted_modules.length+1)) / 180 * Math.PI
      pivot.add( group )
      scene.add( pivot )
      prompted_modules.push group
      objects.push group

addModule = (object) ->
  object.material = mat
  if moduleMode == 1
    cam_modules.push object
  else if moduleMode == 2
    ir_modules.push object
  else if moduleMode == 3
    custom_modules.push object
  index = prompted_modules.indexOf object
  prompted_modules.splice index, 1

deleteModule = (object) ->
  modules = cam_modules.concat(ir_modules).concat(custom_modules)

  x_object =  Math.round(10*object.getWorldPosition().x)/10
  y_object =  Math.round(10*object.getWorldPosition().z)/10

  alert_enabled = 0
  if (modules.includes object) == false
    i = 0
    console.log("Prop iteration")
    while i < modules.length
      x_mod =  Math.round(10*modules[i].getWorldPosition().x)/10
      y_mod =  Math.round(10*modules[i].getWorldPosition().z)/10
      attached = 0

      x_dis_mod = x_mod - x_object
      y_dis_mod = y_mod - y_object
      module_mod = x_dis_mod * x_dis_mod + y_dis_mod * y_dis_mod
      module_mod = Math.sqrt(module_mod)
      console.log("distancia obj mod")
      console.log(module_mod)

      if module_mod < 11
        k = 0
        while k < props.length
          x_prop =  Math.round(10*props[k].getWorldPosition().x)/10
          y_prop =  Math.round(10*props[k].getWorldPosition().z)/10
          x_dis = x_prop - x_mod
          y_dis = y_prop - y_mod
          module = x_dis * x_dis + y_dis * y_dis
          module = Math.sqrt(module)
          #console.log(module)

          if module < 11
            attached = attached + 1
          k++
        if attached < 2
          alert_enabled = 1
      i++
  if alert_enabled == 1
    alert "El borrado compromete a la máquina"
  else
    index = scene.children.indexOf object.parent
    scene.remove scene.children[index]

    index = objects.indexOf object
    objects.splice index, 1

    if cam_modules.includes object
      index = cam_modules.indexOf object
      cam_modules.splice index, 1
    else if ir_modules.includes object
      index = ir_modules.indexOf object
      ir_modules.splice index, 1
    else if custom_modules.includes object
      index = custom_modules.indexOf object
      custom_modules.splice index, 1
    else
      index = props.indexOf object
      props.splice index, 1

    $('#add4props').prop 'disabled', false
    $('#add3props').prop 'disabled', false
    $('#add6props').prop 'disabled', false

    if props.length == 0
      $('#add-random').prop 'disabled', true
      $('#add-ir').prop     'disabled', true
      $('#add-camera').prop 'disabled', true
      $('#save').prop       'disabled', true
      $('#validate').prop   'disabled', true
      $('#stl').prop        'disabled', true

addArduino = () ->
  console.log("loading arduino")
  loader.load "models/arduino.stl", (geometry) ->
    group = new THREE.Mesh(geometry, arduino_mat)
    group.scale.set(0.1, 0.1, 0.1)
    group.rotation.x = -0.5 * Math.PI
    group.rotation.z = Math.PI/1 + Math.PI/180
    group.position.set(-3.5,5,0)
    pivot = new THREE.Object3D()
    pivot.add( group )
    scene.add( pivot )
    objects.push group


addSymmetricProps = (num, offset, rotateTo) ->
  offset ?= 0
  rotateTo ?= 0
  propMode = num
  loader.load "models/prop.stl", (geometry) ->
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
      #box = new THREE.BoxHelper( pivot, 0xffff00 )
      #scene.add( box )
      props.push group
      objects.push group
  $('#validate').prop 'disabled', false
  $('#stl').prop 'disabled', false

changeProps = () ->
  loader.load "models/full_prop.stl", (geometry) ->
    i = 0
    while i < props.length
      angle = props[i].parent.rotation.y
      props[i].geometry.dispose()
      props[i].geometry = geometry.clone()
      props[i].rotation.x = -0.5 * Math.PI
      props[i].rotation.z = 0
      props[i].position.set(16.5,1,0)
      props[i].parent.rotation.y = angle - Math.PI/6
      i++


renderer.domElement.addEventListener 'mousedown', (event) ->
  event.preventDefault()
  raycaster.setFromCamera mouse, camera
  #scene.remove ( arrow );
  #arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff )
  #scene.add( arrow );
  intersects = raycaster.intersectObjects(objects)
  if intersects.length > 0
    selected = intersects[0].object
    if selection != null # if there was an object previously selected
      selection.material = mat # we deselect it
      selection = null
    # check if the user is adding a new module
    if prompted_modules.indexOf(selected) >= 0
      addModule(selected)
    else
      selection = selected
      # highlight
      selection.material = selectionMaterial
      if event.which == 3
        deleteModule(selection)

  else
    if selection != null
      selection.material = mat

$('#save').click ->


toggleSidebar = (name) ->
  $( "#show-" + name + "-sidebar" ).click ->
    clearPromptedModules()
    moduleMode = 0
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
toggleSidebar('validation')

document.getElementById('close-modal').addEventListener "mousedown", (event) ->
  $('.modal').hide()

document.getElementById('new-design').addEventListener "mousedown", (event) ->
  $('.modal').hide()

$("#load-modal-input").change () ->
  loadDrone this.files[0]
  $('.modal').hide()

document.getElementById('validate').addEventListener "mousedown", (event) ->
  $('.modal').show()
  validator()

document.getElementById('stl').addEventListener "mousedown", (event) ->
  addArduino()
  changeProps()
  saveToPrint()

validator = () ->
  modules = cam_modules.concat(ir_modules).concat(custom_modules)

  weight_core      = 74 #grams
  weight_prop      = 51
  weight_module    = 24
  weight_esc       = 4.535924
  weight_cam_module= 0
  weight_engine    = 11.8

  time_core        = 335 #minutes
  time_prop        = 244
  time_module      = 103
  time_cam_module  =   0

  meter_core       = 24.77
  meter_prop       = 17.17
  meter_module     =  7.95
  meter_cam_module =  0

  engine_vol       = 7.4  #volt
  engine_rpm       = 3100 #revolutions in one minute
  engine_max_corr  = 7.9  #amperes
  power_prop       = 58.5 #what
  lift_weight_prop = 190  #grams

  props_weight   = props.length   * weight_prop
  props_time     = props.length   * time_prop
  modules_weight = modules.length * weight_module
  modules_time   = modules.length * time_module
  esc_weight     = props.length   * weight_esc
  engines_weight = props.length   * weight_engine

  total_lift_w   = props.length   * lift_weight_prop
  total_weight   = props_weight   + modules_weight + esc_weight + weight_core + engines_weight
  total_power    = props.length   * power_prop
  total_time     = props_time     + modules_time   + time_core
  battery_life   = (5500/1000)/(engine_max_corr*props.length) * 60

  module_x_distribution = 0
  module_z_distribution = 0

  i = 0
  while i < modules.length
    #console.log(modules[i].getWorldPosition();)
    module_x_distribution += Math.round(modules[i].getWorldPosition().x)
    module_z_distribution += Math.round(modules[i].getWorldPosition().z)
    i++
  x_module = (Math.round(module_x_distribution))
  z_module = (Math.round(module_z_distribution))
  module = x_module * x_module
  module = module + z_module * z_module
  module = Math.sqrt(module)

  final  = new THREE.Vector3( x_module/module, 0, z_module/module );
  origin = new THREE.Vector3( 0, 0, 0 );

  if arrow_module != null
    scene.remove arrow_module

  arrow_module = new THREE.ArrowHelper( final, origin, 100, Math.random() * 0xffffff )
  scene.add( arrow_module );

  $('.modal-body').empty()

  $('.modal-body').append("<p>The model is validated</p>" +
    "<p>The weight of the drone is: " + Math.round(total_weight) + " grams</p>" +
    "<p>The drone can lift this weight: " + Math.round(total_lift_w) + " grams</p>"+
    "<p>The power of the drone is: " + total_power + " whatts</p>" +
    "<p>The estimated time for printing the drone is: " + Math.round(total_time/60)+ " hours</p>" +
    "<p>The duration of battery with 11.1 v and 5500mah is: " + Math.round(battery_life) + " minutes</p>"
  );

saveDrone = () ->
  #TODO remove prompted modules
  sceneJSON = scene.toJSON()
  propsJSON = []
  i = 0
  while i < props.length
    propsJSON.push props[i].uuid
    i += 1

  modulesJSON = []
  modules = cam_modules.concat(ir_modules).concat(custom_modules)
  i = 0
  while i < modules.length
    modulesJSON.push props[i].uuid
    i += 1
  file = {scene: sceneJSON, props: propsJSON, modules: modulesJSON}
  str = JSON.stringify(file)
  element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
  element.setAttribute('download', 'design.bee');
  $('#validation-sidebar').append(element);
  element.click();
  $('#validation-sidebar').remove(element);


loadDrone = (f) ->
  #TODO fix orbit controls issue
  reader = new FileReader()
  reader.onload = () ->
    json = JSON.parse reader.result
    loader = new THREE.ObjectLoader()
    scene = loader.parse( json.scene )
    console.log scene

    propsArray   = json.props
    modulesArray = json.modules

    props = []
    modules = []

    i = 0
    while i < scene.children.length
      obj = scene.children[i]
      if (obj.type == "Object3D")
        j = 0
        while j < obj.children.length
          mod = obj.children[j]
          console.log mod.uuid
          if propsArray.indexOf(mod.uuid) != -1
            props.push mod
          else if modulesArray.indexOf mod.uuid != -1
            modules.push mod
          j += 1
      i += 1

    console.log props
    console.log modules

  render()

saveToPrint = () ->
  file_contents = "<h2>Your drone is ready to print!</h2>" +
                  "<p>You will need to print each file the amount" +
                  " of times indicated to build your drone:</p>"
  file_contents += "<li>1x core.stl"
  file_contents += "<li>" + props.length + "x prop.stl</li>"
  file_contents += "<li>" + custom_modules.length + "x custom_module.stl</li>"
  file_contents += "<li>" + ir_modules.length + "x ir_module.stl</li>"
  file_contents += "<li>" + cam_modules.length + "x cam_module.stl</li><br/>"
  file_contents += "<p>Have fun building your new Beewo drone!</p>"

  $('.modal-body').empty()

  $('.modal-body').append(file_contents)
  $('.modal').show()
