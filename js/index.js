// Generated by CoffeeScript 2.1.1
(function() {
  // basic components
  var addCore, addModule, addSymmetricProps, arrow, arrow_module, cam_modules, camera, clearModules, clearPromptedModules, clearProps, clock, controls, custom_modules, deleteModule, directionalLight, disableButton, enableStep2, ir_modules, loadDrone, loader, mat, moduleMode, modules, mouse, objects, projector, promptModuleSlots, promptedMaterial, prompted_modules, propMode, props, raycaster, render, renderer, saveDrone, saveToPrint, scene, selection, selectionMaterial, sidebarShown, tanFOV, toggleSidebar, validator, windowHeight;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  mouse = new THREE.Vector2();

  // ui vars
  sidebarShown = false;

  // drone structure
  props = [];

  propMode = 0;

  moduleMode = 0;

  custom_modules = [];

  cam_modules = [];

  ir_modules = [];

  modules = [cam_modules, ir_modules, custom_modules];

  prompted_modules = [];

  // scene objects list
  objects = [];

  selection = null;

  arrow = null;

  arrow_module = null;

  selectionMaterial = new THREE.MeshStandardMaterial({
    color: 0x40e0d0
  });

  mat = new THREE.MeshStandardMaterial({
    color: 0xfcde00
  });

  promptedMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    transparent: true,
    opacity: 0.6
  });

  raycaster = new THREE.Raycaster();

  projector = new THREE.Projector();

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor(0xffffff, 1.0);

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type = THREE.PCFShadowMap;

  $('#editor').append(renderer.domElement);

  // camera
  camera.position.z = 15;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(camera);

  // orbit, pan, zoom controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;

  controls.addEventListener('change', function() {
    return render;
  });

  // lightning
  directionalLight = new THREE.DirectionalLight(0xffffff, 2, 100);

  directionalLight.position.set(1, 1, 1);

  directionalLight.castShadow = true;

  scene.add(directionalLight);

  // fog
  scene.fog = new THREE.Fog(0xc1e4e8, 0.015, 100);

  tanFOV = Math.tan((Math.PI / 180) * camera.fov / 2);

  windowHeight = window.innerHeight;

  window.addEventListener("mousemove", function(event) {
    return this.onMouseMove(event);
  });

  window.addEventListener("resize", function(event) {
    return this.onWindowResize(event);
  });

  this.onWindowResize = function(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight));
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer.render(scene, camera);
  };

  this.onMouseMove = function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    return mouse.y = -(event.clientY / window.innerHeight) * 2 + 1.15;
  };

  loader = new THREE.STLLoader();

  loader.crossOrigin = '';

  addCore = function() {
    return loader.load("models/core.stl", function(geometry) {
      var core;
      mat = new THREE.MeshStandardMaterial({
        color: 0xfcde00
      });
      core = new THREE.Mesh(geometry, mat);
      core.rotation.x = -0.5 * Math.PI;
      core.rotation.z = Math.PI / 6;
      core.scale.set(0.1, 0.1, 0.1);
      scene.add(core);
      objects.push(core);
      return core.position.set(0, 1, 0);
    });
  };

  addCore();

  render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    return raycaster.setFromCamera(mouse, camera);
  };

  render();

  document.getElementById('add4props').addEventListener("mousedown", function(event) {
    enableStep2();
    disableButton(4);
    clearProps();
    clearModules();
    clearPromptedModules();
    addSymmetricProps(2, 0, 60);
    addSymmetricProps(1, 60);
    return addSymmetricProps(1, 240);
  });

  document.getElementById('add3props').addEventListener("mousedown", function(event) {
    enableStep2();
    disableButton(3);
    clearProps();
    clearModules();
    clearPromptedModules();
    return addSymmetricProps(3);
  });

  document.getElementById('add6props').addEventListener("mousedown", function(event) {
    enableStep2();
    disableButton(6);
    clearProps();
    clearModules();
    clearPromptedModules();
    return addSymmetricProps(6);
  });

  document.getElementById('add-camera').addEventListener("mousedown", function(event) {
    clearPromptedModules();
    moduleMode = 1;
    return promptModuleSlots("models/cameramodule.stl");
  });

  document.getElementById('add-ir').addEventListener("mousedown", function(event) {
    clearPromptedModules();
    moduleMode = 2;
    return promptModuleSlots("models/irmodule.stl");
  });

  document.getElementById('add-random').addEventListener("mousedown", function(event) {
    clearPromptedModules();
    moduleMode = 3;
    return promptModuleSlots("models/testmodule.stl");
  });

  document.getElementById('save').addEventListener("mousedown", function(event) {
    return saveDrone();
  });

  $("#load-input").change(function() {
    return loadDrone(this.files[0]);
  });

  disableButton = function(n) {
    $('#add4props').prop('disabled', false);
    $('#add3props').prop('disabled', false);
    $('#add6props').prop('disabled', false);
    return $('#add' + n + 'props').prop('disabled', true);
  };

  enableStep2 = function() {
    return $('#add-random').prop('disabled', false);
  };

  clearProps = function() {
    var i, index;
    i = 0;
    while (i < props.length) {
      index = scene.children.indexOf(props[i].parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(props[i]);
      objects.splice(index, 1);
      i++;
    }
    return props = [];
  };

  clearModules = function() {
    var i, index;
    i = 0;
    while (i < modules.length) {
      index = scene.children.indexOf(modules[i].parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(modules[i]);
      objects.splice(index, 1);
      i++;
    }
    return modules = [];
  };

  clearPromptedModules = function() {
    var i, index;
    i = 0;
    while (i < prompted_modules.length) {
      index = scene.children.indexOf(prompted_modules[i].parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(prompted_modules[i]);
      objects.splice(index, 1);
      i++;
    }
    return prompted_modules = [];
  };

  promptModuleSlots = function(model) {
    return loader.load(model, function(geometry) {
      var angle, group, num_modules, pivot, position, position_x, results;
      angle = -30;
      position = -10;
      position_x = 0;
      if (propMode === 3) {
        angle = -30;
        position = -10;
        num_modules = 3;
      } else if (propMode === 6) {
        angle = 30;
        position = -20;
        num_modules = 6;
      } else {
        num_modules = 2;
        position = -10;
        position_x = 17;
      }
      results = [];
      while (prompted_modules.length < num_modules) {
        group = new THREE.Mesh(geometry, promptedMaterial);
        group.scale.set(0.1, 0.1, 0.1);
        group.rotation.x = -0.5 * Math.PI;
        group.rotation.z = angle / 180 * Math.PI;
        group.position.set(position_x, 1, position);
        pivot = new THREE.Object3D();
        pivot.rotation.y = (360 / num_modules * (prompted_modules.length + 1)) / 180 * Math.PI;
        pivot.add(group);
        scene.add(pivot);
        prompted_modules.push(group);
        results.push(objects.push(group));
      }
      return results;
    });
  };

  addModule = function(object, mode) {
    var index;
    object.material = mat;
    modules[mode - 1].push(object);
    index = prompted_modules.indexOf(object);
    prompted_modules.splice(index, 1);
    return modules_count[mode - 1] += 1;
  };

  deleteModule = function(object) {
    var index;
    index = scene.children.indexOf(object.parent);
    scene.remove(scene.children[index]);
    index = objects.indexOf(object);
    objects.splice(index, 1);
    index = modules.indexOf(object);
    modules.splice(index, 1);
    index = props.indexOf(object);
    return props.splice(index, 1);
  };

  addSymmetricProps = function(num, offset, rotateTo) {
    if (offset == null) {
      offset = 0;
    }
    if (rotateTo == null) {
      rotateTo = 0;
    }
    propMode = num;
    loader.load("models/prop.stl", function(geometry) {
      var group, i, pivot, results;
      i = 1;
      results = [];
      while (i <= num) {
        group = new THREE.Mesh(geometry, mat);
        group.scale.set(0.1, 0.1, 0.1);
        group.rotation.x = -0.5 * Math.PI;
        group.rotation.z = Math.PI / 6 + rotateTo * Math.PI / 180;
        group.position.set(16.5, 1, 0);
        pivot = new THREE.Object3D();
        pivot.add(group);
        pivot.rotation.y = (360 / num + offset) / 180 * Math.PI * i++;
        scene.add(pivot);
        //box = new THREE.BoxHelper( pivot, 0xffff00 )
        //scene.add( box )
        props.push(group);
        results.push(objects.push(group));
      }
      return results;
    });
    return $('#validate').prop('disabled', false);
  };

  renderer.domElement.addEventListener('mousedown', function(event) {
    var intersects, selected;
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    //scene.remove ( arrow );
    //arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff )
    //scene.add( arrow );
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      selected = intersects[0].object;
      if (selection !== null) { // if there was an object previously selected
        selection.material = mat; // we deselect it
        selection = null;
      }
      // check if the user is adding a new module
      if (prompted_modules.indexOf(selected) >= 0) {
        return addModule(selected, moduleMode);
      } else {
        selection = selected;
        // highlight
        selection.material = selectionMaterial;
        if (event.which === 3) {
          return deleteModule(selection);
        }
      }
    } else {
      if (selection !== null) {
        return selection.material = mat;
      }
    }
  });

  $('#save').click(function() {});

  toggleSidebar = function(name) {
    return $("#show-" + name + "-sidebar").click(function() {
      clearPromptedModules();
      moduleMode = 0;
      if (sidebarShown) {
        sidebarShown = false;
        $("#" + name + "-sidebar").animate({
          right: "-20%"
        }, {
          duration: 500,
          queue: false
        }, function() {});
        return $("#show-" + name + "-sidebar").animate({
          right: 0
        }, {
          duration: 500,
          queue: false
        }, function() {});
      } else {
        sidebarShown = true;
        $("#" + name + "-sidebar").animate({
          right: 0
        }, {
          duration: 500,
          queue: false
        }, function() {});
        return $("#show-" + name + "-sidebar").animate({
          right: "20%"
        }, {
          duration: 500,
          queue: false
        }, function() {});
      }
    });
  };

  toggleSidebar('props');

  toggleSidebar('extras');

  toggleSidebar('validation');

  document.getElementById('close-modal').addEventListener("mousedown", function(event) {
    return $('.modal').hide();
  });

  document.getElementById('validate').addEventListener("mousedown", function(event) {
    $('.modal').show();
    return validator();
  });

  document.getElementById('stl').addEventListener("mousedown", function(event) {
    return saveToPrint();
  });

  validator = function() {
    var battery_life, engine_max_corr, engine_rpm, engine_vol, engines_weight, esc_weight, final, i, lift_weight_prop, meter_cam_module, meter_core, meter_module, meter_prop, module, module_x_distribution, module_z_distribution, modules_time, modules_weight, origin, power_prop, props_time, props_weight, time_cam_module, time_core, time_module, time_prop, total_lift_w, total_power, total_time, total_weight, weight_cam_module, weight_core, weight_engine, weight_esc, weight_module, weight_prop, x_module, z_module;
    weight_core = 74; //grams
    weight_prop = 51;
    weight_module = 24;
    weight_esc = 4.535924;
    weight_cam_module = 0;
    weight_engine = 11.8;
    time_core = 335; //minutes
    time_prop = 244;
    time_module = 103;
    time_cam_module = 0;
    meter_core = 24.77;
    meter_prop = 17.17;
    meter_module = 7.95;
    meter_cam_module = 0;
    engine_vol = 7.4; //volt
    engine_rpm = 3100; //revolutions in one minute
    engine_max_corr = 7.9; //amperes
    power_prop = 58.5; //what
    lift_weight_prop = 190; //grams
    props_weight = props.length * weight_prop;
    props_time = props.length * time_prop;
    modules_weight = modules.length * weight_module;
    modules_time = modules.length * time_module;
    esc_weight = props.length * weight_esc;
    engines_weight = props.length * weight_engine;
    total_lift_w = props.length * lift_weight_prop;
    total_weight = props_weight + modules_weight + esc_weight + weight_core + engines_weight;
    total_power = props.length * power_prop;
    total_time = props_time + modules_time + time_core;
    battery_life = (5500 / 1000) / (engine_max_corr * props.length) * 60;
    module_x_distribution = 0;
    module_z_distribution = 0;
    i = 0;
    while (i < modules.length) {
      //console.log(modules[i].getWorldPosition();)
      module_x_distribution += Math.round(modules[i].getWorldPosition().x);
      module_z_distribution += Math.round(modules[i].getWorldPosition().z);
      i++;
    }
    x_module = Math.round(module_x_distribution);
    z_module = Math.round(module_z_distribution);
    module = x_module * x_module;
    module = module + z_module * z_module;
    module = Math.sqrt(module);
    final = new THREE.Vector3(x_module / module, 0, z_module / module);
    origin = new THREE.Vector3(0, 0, 0);
    if (arrow_module !== null) {
      scene.remove(arrow_module);
    }
    arrow_module = new THREE.ArrowHelper(final, origin, 100, Math.random() * 0xffffff);
    scene.add(arrow_module);
    $('.modal-body').empty();
    return $('#modal').append("<p>The model is validated</p>" + "<p>The weight of the drone is: " + Math.round(total_weight) + " grams</p>" + "<p>The drone can lift this weight: " + Math.round(total_lift_w) + " grams</p>" + "<p>The power of the drone is: " + total_power + " whatts</p>" + "<p>The estimated time for printing the drone is: " + Math.round(total_time / 60) + " hours</p>" + "<p>The duration of battery with 11.1 v and 5500mah is: " + Math.round(battery_life) + " minutes</p>");
  };

  saveDrone = function() {
    var element, file, i, modulesJSON, propsJSON, sceneJSON, str;
    //TODO remove prompted modules
    sceneJSON = scene.toJSON();
    propsJSON = [];
    i = 0;
    while (i < props.length) {
      propsJSON.push(props[i].uuid);
      i += 1;
    }
    modulesJSON = [];
    i = 0;
    while (i < modules.length) {
      modulesJSON.push(props[i].uuid);
      i += 1;
    }
    file = {
      scene: sceneJSON,
      props: propsJSON,
      modules: modulesJSON
    };
    str = JSON.stringify(file);
    element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
    element.setAttribute('download', 'design.bee');
    $('#validation-sidebar').append(element);
    element.click();
    return $('#validation-sidebar').remove(element);
  };

  loadDrone = function(f) {
    var reader;
    //TODO fix orbit controls issue
    reader = new FileReader();
    reader.onload = function() {
      var i, j, json, mod, modulesArray, obj, propsArray;
      json = JSON.parse(reader.result);
      loader = new THREE.ObjectLoader();
      scene = loader.parse(json.scene);
      console.log(scene);
      propsArray = json.props;
      modulesArray = json.modules;
      props = [];
      modules = [];
      i = 0;
      while (i < scene.children.length) {
        obj = scene.children[i];
        if (obj.type === "Object3D") {
          j = 0;
          while (j < obj.children.length) {
            mod = obj.children[j];
            console.log(mod.uuid);
            if (propsArray.indexOf(mod.uuid) !== -1) {
              props.push(mod);
            } else if (modulesArray.indexOf(mod.uuid !== -1)) {
              modules.push(mod);
            }
            j += 1;
          }
        }
        i += 1;
      }
      console.log(props);
      return console.log(modules);
    };
    return render();
  };

  saveToPrint = function() {
    var file_contents, files, zip;
    file_contents = "You will need to print each file the amount" + " of times indicated to build your drone:\n\n";
    file_contents += "1x core.stl\n";
    file_contents += props.length + "x prop.stl\n";
    file_contents += custom_modules.length + "x custom_module.stl\n";
    file_contents += ir_modules.length + "x ir_module.stl\n";
    file_contents += cam_modules.length + "x cam_module.stl\n\n";
    file_contents += "Have fun building your new Beewo drone!";
    zip = new JSZip();
    zip.file("INSTRUCTIONS.txt", file_contents);
    files = zip.folder("files");
    return zip.generateAsync({
      type: "base64"
    }).then(function(base64) {
      return location.href = "data:application/zip;base64," + base64;
    });
  };

}).call(this);
