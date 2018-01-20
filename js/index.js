// Generated by CoffeeScript 1.12.7
(function() {
  var addCore, addModule, addSymmetricProps, arrow, arrow_module, camera, clearModules, clearPromptedModules, clearProps, clock, controls, deleteModule, directionalLight, disableButton, enableStep2, loader, mat, modules, mouse, objects, projector, promptModuleSlots, promptedMaterial, prompted_modules, props, raycaster, render, renderer, saveDrone, scene, selection, selectionMaterial, sidebarShown, tanFOV, toggleSidebar, validator, windowHeight;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  mouse = new THREE.Vector2();

  sidebarShown = false;

  props = [];

  modules = [];

  prompted_modules = [];

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

  camera.position.z = 15;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(camera);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;

  controls.addEventListener('change', function() {
    return render;
  });

  directionalLight = new THREE.DirectionalLight(0xffffff, 2, 100);

  directionalLight.position.set(1, 1, 1);

  directionalLight.castShadow = true;

  scene.add(directionalLight);

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

  document.getElementById('add-random').addEventListener("mousedown", function(event) {
    clearPromptedModules();
    return promptModuleSlots("models/testmodule.stl");
  });

  document.getElementById('save').addEventListener("mousedown", function(event) {
    return saveDrone();
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
      if (props.length === 3) {
        angle = -30;
        position = -10;
        num_modules = 3;
      } else if (props.length === 6) {
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

  addModule = function(object) {
    var index;
    object.material = mat;
    modules.push(object);
    index = prompted_modules.indexOf(object);
    return prompted_modules.splice(index, 1);
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
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      selected = intersects[0].object;
      if (selection !== null) {
        selection.material = mat;
        selection = null;
      }
      if (prompted_modules.indexOf(selected) >= 0) {
        return addModule(selected);
      } else {
        selection = selected;
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

  toggleSidebar = function(name) {
    return $("#show-" + name + "-sidebar").click(function() {
      clearPromptedModules();
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

  validator = function() {
    var battery_life, engine_max_corr, engine_rpm, engine_vol, engines_weight, esc_weight, final, i, lift_weight_prop, meter_cam_module, meter_core, meter_module, meter_prop, module, module_x_distribution, module_z_distribution, modules_time, modules_weight, origin, power_prop, props_time, props_weight, time_cam_module, time_core, time_module, time_prop, total_lift_w, total_power, total_time, total_weight, weight_cam_module, weight_core, weight_engine, weight_esc, weight_module, weight_prop, x_module, z_module;
    weight_core = 74;
    weight_prop = 51;
    weight_module = 24;
    weight_esc = 4.535924;
    weight_cam_module = 0;
    weight_engine = 11.8;
    time_core = 335;
    time_prop = 244;
    time_module = 103;
    time_cam_module = 0;
    meter_core = 24.77;
    meter_prop = 17.17;
    meter_module = 7.95;
    meter_cam_module = 0;
    engine_vol = 7.4;
    engine_rpm = 3100;
    engine_max_corr = 7.9;
    power_prop = 58.5;
    lift_weight_prop = 190;
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

  saveDrone = function() {};

}).call(this);
