(function() {
  var addArduino, addCore, addModule, addSymmetricProps, arduino_mat, arrow, arrow_module, cam_modules, camera, changeProps, cleanPrompts, clearModules, clearPromptedModules, clearProps, clock, controls, custom_modules, deleteModule, directionalLight, disableButton, enableStep2, ir_modules, light, loadDrone, loader, mat, moduleMode, mouse, objects, projector, promptModuleSlots, promptedMaterial, prompted_modules, propMode, props, raycaster, render, renderer, saveDrone, saveToPrint, scene, selection, selectionMaterial, sidebarShown, tanFOV, toggleSidebar, validator, windowHeight;

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

  propMode = 0;

  moduleMode = 0;

  custom_modules = [];

  cam_modules = [];

  ir_modules = [];

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

  arduino_mat = new THREE.MeshStandardMaterial({
    color: 0x3f6f70
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

  renderer.autoClear = false;

  renderer.setClearColor(0xffffff, 0.0);

  $('#editor').append(renderer.domElement);

  camera.position.z = 15;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(camera);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;

  controls.addEventListener('change', function() {
    return render;
  });

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.6, 100);

  directionalLight.position.set(0, 10, 0);

  directionalLight.castShadow = true;

  scene.add(directionalLight);

  light = new THREE.AmbientLight(0xffffff, 1.2);

  light.position.set(5, 1, 1);

  light.castShadow = true;

  scene.add(light);

  scene.fog = new THREE.Fog(0xc1e4e8, 0.015, 400);

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
    $('#add-random').prop('disabled', false);
    $('#add-ir').prop('disabled', false);
    return $('#add-camera').prop('disabled', false);
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
    while (i < cam_modules.length) {
      index = scene.children.indexOf(cam_modules[i].parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(cam_modules[i]);
      alert(index);
      objects.splice(index, 1);
      i++;
    }
    cam_modules = [];
    i = 0;
    while (i < ir_modules.length) {
      index = scene.children.indexOf(ir_modules[i].parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(ir_modules[i]);
      alert(index);
      objects.splice(index, 1);
      i++;
    }
    ir_modules = [];
    i = 0;
    while (i < custom_modules.length) {
      index = scene.children.indexOf(custom_modules[i].parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(custom_modules[i]);
      objects.splice(index, 1);
      i++;
    }
    return custom_modules = [];
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
      var angle, group, num_modules, pivot, position, position_x;
      angle = -30;
      position = -10;
      position_x = 0;
      if (propMode === 3) {
        position_x = 4;
        angle = -30;
        position = -12;
        num_modules = 3;
      } else if (propMode === 6) {
        angle = 30;
        position = -24;
        num_modules = 6;
      } else {
        num_modules = 2;
        position = -12;
        position_x = 21;
      }
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
        objects.push(group);
      }
      return setTimeout(function() {
        var found, h, i, module, module_mod, modules, results, x_dis_mod, x_mod, x_object, y_dis_mod, y_mod, y_object;
        modules = cam_modules.concat(ir_modules).concat(custom_modules);
        h = 0;
        results = [];
        while (h < prompted_modules.length) {
          module = objects[objects.indexOf(prompted_modules[h])];
          x_object = Math.round(10 * module.getWorldPosition().x) / 10;
          y_object = Math.round(10 * module.getWorldPosition().z) / 10;
          i = 0;
          found = false;
          while (i < props.length) {
            x_mod = Math.round(10 * props[i].getWorldPosition().x) / 10;
            y_mod = Math.round(10 * props[i].getWorldPosition().z) / 10;
            x_dis_mod = x_mod - x_object;
            y_dis_mod = y_mod - y_object;
            module_mod = x_dis_mod * x_dis_mod + y_dis_mod * y_dis_mod;
            module_mod = Math.sqrt(module_mod);
            if (module_mod < 15) {
              found = true;
              console.log("FOUND");
              break;
            }
            i++;
          }
          if (found === false) {
            console.log("NEVER FOUND");
            scene.remove(module.parent);
            prompted_modules.splice(h, 1);
            objects.splice(objects.indexOf(module), 1);
          }
          i = 0;
          while (i < modules.length) {
            x_mod = Math.round(10 * modules[i].getWorldPosition().x) / 10;
            y_mod = Math.round(10 * modules[i].getWorldPosition().z) / 10;
            x_dis_mod = x_mod - x_object;
            y_dis_mod = y_mod - y_object;
            console.log(x_dis_mod + y_dis_mod);
            if (Math.abs(x_dis_mod + y_dis_mod) < 0.5) {
              console.log("ALREADY BUILT");
              scene.remove(module.parent);
              prompted_modules.splice(h, 1);
              objects.splice(objects.indexOf(module), 1);
            }
            i++;
          }
          results.push(h++);
        }
        return results;
      }, 350);
    });
  };

  cleanPrompts = function() {
    return true;
  };

  addModule = function(object) {
    var index;
    object.material = mat;
    if (moduleMode === 1) {
      cam_modules.push(object);
    } else if (moduleMode === 2) {
      ir_modules.push(object);
    } else if (moduleMode === 3) {
      custom_modules.push(object);
    }
    index = prompted_modules.indexOf(object);
    return prompted_modules.splice(index, 1);
  };

  deleteModule = function(object) {
    var alert_enabled, attached, i, index, k, module, module_mod, modules, x_dis, x_dis_mod, x_mod, x_object, x_prop, y_dis, y_dis_mod, y_mod, y_object, y_prop;
    modules = cam_modules.concat(ir_modules).concat(custom_modules);
    x_object = Math.round(10 * object.getWorldPosition().x) / 10;
    y_object = Math.round(10 * object.getWorldPosition().z) / 10;
    alert_enabled = 0;
    if ((modules.includes(object)) === false) {
      i = 0;
      console.log("Prop iteration");
      while (i < modules.length) {
        x_mod = Math.round(10 * modules[i].getWorldPosition().x) / 10;
        y_mod = Math.round(10 * modules[i].getWorldPosition().z) / 10;
        attached = 0;
        console.log(modules[i].getWorldPosition());
        x_dis_mod = x_mod - x_object;
        y_dis_mod = y_mod - y_object;
        module_mod = x_dis_mod * x_dis_mod + y_dis_mod * y_dis_mod;
        module_mod = Math.sqrt(module_mod);
        console.log("distancia obj mod");
        console.log(module_mod);
        if (module_mod < 15) {
          k = 0;
          while (k < props.length) {
            x_prop = Math.round(10 * props[k].getWorldPosition().x) / 10;
            y_prop = Math.round(10 * props[k].getWorldPosition().z) / 10;
            x_dis = x_prop - x_mod;
            y_dis = y_prop - y_mod;
            module = x_dis * x_dis + y_dis * y_dis;
            module = Math.sqrt(module);
            if (module < 15) {
              attached = attached + 1;
            }
            k++;
          }
          if (attached < 2) {
            alert_enabled = 1;
          }
        }
        i++;
      }
    }
    if (alert_enabled === 1) {
      return alert("El borrado compromete a la máquina");
    } else {
      index = scene.children.indexOf(object.parent);
      scene.remove(scene.children[index]);
      index = objects.indexOf(object);
      objects.splice(index, 1);
      if (cam_modules.includes(object)) {
        index = cam_modules.indexOf(object);
        cam_modules.splice(index, 1);
      } else if (ir_modules.includes(object)) {
        index = ir_modules.indexOf(object);
        ir_modules.splice(index, 1);
      } else if (custom_modules.includes(object)) {
        index = custom_modules.indexOf(object);
        custom_modules.splice(index, 1);
      } else {
        index = props.indexOf(object);
        props.splice(index, 1);
      }
      $('#add4props').prop('disabled', false);
      $('#add3props').prop('disabled', false);
      $('#add6props').prop('disabled', false);
      if (props.length === 0) {
        $('#add-random').prop('disabled', true);
        $('#add-ir').prop('disabled', true);
        $('#add-camera').prop('disabled', true);
        $('#validate').prop('disabled', true);
        return $('#stl').prop('disabled', true);
      }
    }
  };

  addArduino = function() {
    console.log("loading arduino");
    return loader.load("models/arduino.stl", function(geometry) {
      var group, pivot;
      group = new THREE.Mesh(geometry, arduino_mat);
      group.scale.set(0.1, 0.1, 0.1);
      group.rotation.x = -0.5 * Math.PI;
      group.rotation.z = Math.PI / 1 + Math.PI / 180;
      group.position.set(-3.5, 5, 0);
      pivot = new THREE.Object3D();
      pivot.add(group);
      scene.add(pivot);
      return objects.push(group);
    });
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
        props.push(group);
        results.push(objects.push(group));
      }
      return results;
    });
    $('#validate').prop('disabled', false);
    return $('#stl').prop('disabled', false);
  };

  changeProps = function() {
    return loader.load("models/full_prop.stl", function(geometry) {
      var angle, i, results;
      i = 0;
      results = [];
      while (i < props.length) {
        angle = props[i].parent.rotation.y;
        props[i].geometry.dispose();
        props[i].geometry = geometry.clone();
        props[i].rotation.x = -0.5 * Math.PI;
        props[i].rotation.z = 0;
        props[i].position.set(15.5, 0, 0);
        props[i].parent.rotation.y = angle - Math.PI / 6;
        results.push(i++);
      }
      return results;
    });
  };

  renderer.domElement.addEventListener('mousedown', function(event) {
    var intersects, selected;
    event.preventDefault();
    console.log("CLICK");
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

  document.getElementById('new-design').addEventListener("mousedown", function(event) {
    return $('.modal').hide();
  });

  $("#load-modal-input").change(function() {
    loadDrone(this.files[0]);
    return $('.modal').hide();
  });

  document.getElementById('validate').addEventListener("mousedown", function(event) {
    $('.modal').show();
    return validator();
  });

  document.getElementById('stl').addEventListener("mousedown", function(event) {
    addArduino();
    changeProps();
    return saveToPrint();
  });

  validator = function() {
    var battery_life, engine_max_corr, engine_rpm, engine_vol, engines_weight, esc_weight, final, i, lift_weight_prop, meter_cam_module, meter_core, meter_module, meter_prop, modpr, module, module_x_distribution, module_z_distribution, modules, modules_time, modules_weight, origin, power_prop, propps_x_distribution, propps_z_distribution, props_time, props_weight, time_cam_module, time_core, time_module, time_prop, total_lift_w, total_power, total_time, total_weight, weight_cam_module, weight_core, weight_engine, weight_esc, weight_module, weight_prop, x_module, x_propps, z_module, z_propps;
    modules = cam_modules.concat(ir_modules).concat(custom_modules);
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
    propps_x_distribution = 0;
    propps_z_distribution = 0;
    i = 0;
    while (i < props.length) {
      propps_x_distribution += props[i].getWorldPosition().x;
      propps_z_distribution += props[i].getWorldPosition().z;
      i++;
    }
    x_propps = Math.round(propps_x_distribution);
    z_propps = Math.round(propps_z_distribution);
    modpr = x_propps * x_propps + z_propps * z_propps;
    modpr = Math.sqrt(modpr);
    if (modpr < 0.1) {
      modpr = 0.1;
    }
    console.log(x_propps / modpr, 0, z_propps / modpr);
    x_propps = (x_propps / modpr) * 2;
    z_propps = (z_propps / modpr) * 2;
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
    x_module = x_module / module;
    z_module = z_module / module;
    x_module = (x_module + x_propps) / 3;
    z_module = (z_module + z_propps) / 3;
    final = new THREE.Vector3(x_module, 0, z_module);
    origin = new THREE.Vector3(0, 0, 0);
    if (arrow_module !== null) {
      scene.remove(arrow_module);
    }
    arrow_module = new THREE.ArrowHelper(final, origin, 100, Math.random() * 0xffffff);
    scene.add(arrow_module);
    $('.modal-body').empty();
    return $('.modal-body').append("<p>The model is validated</p>" + "<p>The weight of the drone is: " + Math.round(total_weight) + " grams</p>" + "<p>The drone can lift this weight: " + Math.round(total_lift_w) + " grams</p>" + "<p>The power of the drone is: " + total_power + " whatts</p>" + "<p>The estimated time for printing the drone is: " + Math.round(total_time / 60) + " hours</p>" + "<p>The duration of battery with 11.1 v and 5500mah is: " + Math.round(battery_life) + " minutes</p>");
  };

  saveDrone = function() {
    var cam_modulesJSON, custom_modulesJSON, element, file, i, ir_modulesJSON, propsJSON, sceneJSON, str;
    //TODO remove prompted modules
    sceneJSON = scene.toJSON();
    propsJSON = [];
    i = 0;
    while (i < props.length) {
      propsJSON.push(props[i].uuid);
      i += 1;
    }
    cam_modulesJSON = [];
    i = 0;
    while (i < cam_modules.length) {
      cam_modulesJSON.push(cam_modules[i].uuid);
      i += 1;
    }
    ir_modulesJSON = [];
    i = 0;
    while (i < ir_modules.length) {
      ir_modulesJSON.push(ir_modules[i].uuid);
      i += 1;
    }
    custom_modulesJSON = [];
    i = 0;
    while (i < custom_modules.length) {
      custom_modulesJSON.push(custom_modules[i].uuid);
      i += 1;
    }
    file = {
      scene: sceneJSON,
      props: propsJSON,
      cam_modules: cam_modulesJSON,
      ir_modules: ir_modulesJSON,
      custom_modules: custom_modulesJSON
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
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    console.log("LOADING");
    reader = new FileReader();
    reader.onload = function() {
      var camArray, customArray, irArray, json, propsArray;
      console.log("LOADED");
      json = JSON.parse(reader.result);
      loader = new THREE.ObjectLoader();
      scene = loader.parse(json.scene);
      propsArray = json.props;
      camArray = json.cam_modules;
      irArray = json.ir_modules;
      customArray = json.custom_modules;
      objects = [];
      props = [];
      cam_modules = [];
      ir_modules = [];
      custom_modules = [];
      setTimeout(function() {
        var i, j, mod, obj, results;
        i = 0;
        results = [];
        while (i < scene.children.length) {
          obj = scene.children[i];
          if (obj.type === "Object3D") {
            j = 0;
            while (j < obj.children.length) {
              mod = obj.children[j];
              objects.push(mod);
              console.log(mod.uuid);
              if (propsArray.indexOf(mod.uuid) !== -1) {
                props.push(mod);
              } else if (camArray.indexOf(mod.uuid !== -1)) {
                cam_modules.push(mod);
              } else if (irArray.indexOf(mod.uuid !== -1)) {
                ir_modules.push(mod);
              } else if (customArray.indexOf(mod.uuid !== -1)) {
                custom_modules.push(mod);
              }
              j += 1;
            }
          }
          results.push(i += 1);
        }
        return results;
      }, 250);
      loader = new THREE.STLLoader();
      loader.crossOrigin = '';
      raycaster = new THREE.Raycaster();
      projector = new THREE.Projector();
      console.log(props);
      console.log(cam_modules);
      console.log(ir_modules);
      console.log(custom_modules);
      return console.log(objects);
    };
    reader.readAsText(f);
    return render();
  };

  saveToPrint = function() {
    var file_contents;
    file_contents = "<h2>Your drone is ready to print!</h2>" + "<p>You will need to print each file the amount" + " of times indicated to build your drone:</p>";
    file_contents += "<li>1x core.stl";
    file_contents += "<li>" + props.length + "x prop.stl</li>";
    file_contents += "<li>" + custom_modules.length + "x custom_module.stl</li>";
    file_contents += "<li>" + ir_modules.length + "x ir_module.stl</li>";
    file_contents += "<li>" + cam_modules.length + "x cam_module.stl</li><br/>";
    file_contents += "<p>Have fun building your new Beewo drone!</p>";
    $('.modal-body').empty();
    $('.modal-body').append(file_contents);
    return $('.modal').show();
  };

}).call(this);
