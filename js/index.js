// Generated by CoffeeScript 2.0.2
(function() {
  // basic components
  var addCore, addModule, addSymmetricProps, camera, clearModules, clearPromptedModules, clearProps, clock, controls, directionalLight, disableButton, enableStep2, loader, mat, modules, mouse, objects, projector, promptModuleSlots, promptedMaterial, prompted_modules, props, raycaster, render, renderer, saveDrone, scene, selection, selectionMaterial, sidebarShown, tanFOV, toggleSidebar, windowHeight;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  mouse = new THREE.Vector2();

  //ui vars
  sidebarShown = false;

  //drone structure
  props = [];

  modules = [];

  prompted_modules = [];

  // scene objects list
  objects = [];

  selection = null;

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

  window.addEventListener("resize", (event) => {
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

  //STL loader
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
    return renderer.render(scene, camera);
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
        position_x = 20;
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
    object.material = mat;
    modules.push(object);
    return prompted_modules.remove(object);
  };

  addSymmetricProps = function(num, offset, rotateTo) {
    if (offset == null) {
      offset = 0;
    }
    if (rotateTo == null) {
      rotateTo = 0;
    }
    return loader.load("models/prop.stl", function(geometry) {
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
  };

  renderer.domElement.addEventListener('mousedown', function(event) {
    var intersects, selected;
    event.preventDefault();
    mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      selected = intersects[0].object;
      if (selection !== null) { // if there was an object previously selected
        selection.material = mat; // we deselect it
        selection = null;
      }
      // check if the user is adding a new module
      if (prompted_modules.indexOf(selected) >= 0) {
        console.log("modulo");
        return addModule(selected);
      } else {
        selection = selected;
        // highlight
        console.log("pieza");
        return selection.material = selectionMaterial;
      }
    } else {
      if (selection !== null) {
        return selection.material = mat;
      }
    }
  });

  toggleSidebar = function(name) {
    clearPromptedModules();
    return $("#show-" + name + "-sidebar").click(function() {
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

  saveDrone = function() {
    var modulesJSON, objectJSON, propsJSON, sceneJSON;
    sceneJSON = scene.toJSON();
    objectJSON = JSON.stringify(objects);
    propsJSON = JSON.stringify(props);
    modulesJSON = JSON.stringify(modules);
    return console.log(json);
  };

}).call(this);
