'use strict';

function WX3D() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'container';
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'http://jsonplaceholder.typicode.com/users';

    this.table = [];
    this.current = 5;
    this.container = document.getElementById(id);
    this.size = {
        width: this.container.clientWidth,
        height: this.container.clientHeight
    };
    this.url = url;

    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.stats = null;
    this.controls = null;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
}

Object.assign(WX3D.prototype, {
    init: function init() {
        var _this = this;

        this.getData(function (data) {
            data = [{
                img: "../chengzhangzhilu/img/0.png",
                info: ['1-1', '1-2', '1-3', '1-4']
            }, {
                img: "../chengzhangzhilu/img/1.png",
                info: ['2-1', '2-2', '2-3', '2-4']
            }, {
                img: "../chengzhangzhilu/img/2.png",
                info: ['3-1', '3-2', '3-3', '3-4']
            }, {
                img: "../chengzhangzhilu/img/3.png",
                info: ['4-1', '4-2', '4-3', '4-4']
            }, {
                img: "../chengzhangzhilu/img/4.png",
                info: ['5-1', '5-2', '5-3', '5-4']
            }, {
                img: "../chengzhangzhilu/img/5.png",
                info: ['6-1', '6-2', '6-3', '6-4']
            }, {
                img: "../chengzhangzhilu/img/6.png",
                info: ['7-1', '7-2', '7-3', '7-4']
            }, {
                img: "../chengzhangzhilu/img/7.png",
                info: ['8-1', '8-2', '8-3', '8-4']
            }, {
                img: "../chengzhangzhilu/img/8.png",
                info: ['9-1', '9-2', '9-3', '9-4']
            }, {
                img: "../chengzhangzhilu/img/9.png",
                info: ['10-1', '10-2', '10-3', '10-4']
            }, {
                img: "../chengzhangzhilu/img/10.png",
                info: ['11-1', '11-2', '11-3', '11-4']
            }, {
                img: "../chengzhangzhilu/img/11.png",
                info: ['12-1', '12-2', '12-3', '12-4']
            }, {
                img: "../chengzhangzhilu/img/12.png",
                info: ['12-1', '12-2', '12-3', '12-4']
            }, {
                img: "../chengzhangzhilu/img/13.png",
                info: ['13-1', '13-2', '13-3', '13-4']
            }, {
                img: "../chengzhangzhilu/img/14.png",
                info: ['14-1', '14-2', '14-3', '14-4']
            }];
            _this.table = data;
            _this.initScene();
            _this.animate();
        });
    },
    getData: function getData(callback) {
        callback();
        return;
        fetch(this.url).then(function (response) {
            return response.json();
        }).then(function (data) {
            return callback(data);
        }).catch(function (error) {
            return console.log('error is', error);
        });
    },
    initScene: function initScene() {
        var cameraL = 500;
        // this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // this.camera.position.set(400, 600, 400);
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 2000);
        this.camera.position.set(cameraL, parseInt(cameraL * Math.sqrt(2) / Math.sqrt(3) * 1.2), cameraL);
        // this.camera.position.set(cameraL, 2*cameraL, cameraL);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        // this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

        this.renderer = new THREE.WebGLRenderer({
            // logarithmicDepthBuffer: true,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.size.width, this.size.height);
        this.container.appendChild(this.renderer.domElement);

        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        this.controls = new THREE.MapControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', this.render.bind(this)); // call this only in static scenes (i.e., if there is no animation loop)
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = false;
        this.controls.enableRotate = false;
        this.controls.screenSpacePanning = false;
        /* this.controls.minDistance = 1;
        this.controls.maxDistance = 500; */
        this.controls.panSpeed = 0.5;
        this.controls.maxPolarAngle = Math.PI / 2;

        var dis = 2,
            l = 40;
        var geometry = new THREE.BoxBufferGeometry(l, 6, l);
        var textures = [new THREE.TextureLoader().load('../chengzhangzhilu/texture/up_dark.png'), new THREE.TextureLoader().load('../chengzhangzhilu/texture/up_llight.png')]
        var passMats = [new THREE.MeshPhongMaterial({
            // color: 0x228B22,
            map: textures[0]
            // flatShading: true
        }), new THREE.MeshPhongMaterial({
            // color: 0x228B22,
            map: textures[1]
            // flatShading: true
        })];
        var currentMats = [new THREE.MeshPhongMaterial({
            // color: 0x87CEEB,
            map: textures[0]
            // flatShading: true
        }), new THREE.MeshPhongMaterial({
            // color: 0x87CEEB,
            map: textures[1]
            // flatShading: true
        })]
        var futureMats = [new THREE.MeshPhongMaterial({
            // color: 0xD3D3D3,
            map: textures[0]
            // flatShading: true
        }), new THREE.MeshPhongMaterial({
            // color: 0xD3D3D3,
            map: textures[1]
            // flatShading: true
        })];
        var planeGeometry = new THREE.PlaneBufferGeometry((l + dis) * 3, (l + dis) * 3);
        for (var i = 0; i < this.table.length; i++) {
            // var mat = i < this.current ? passMats[i%2] : i == this.current ? currentMats[i%2] : futureMats[i%2];
            if (i == 0) {
                var mat = passMats[1];
                var mesh = new THREE.Mesh(geometry, mat);
                var group = this.createGroup(l, 6, 3, mat);
                group.position.z = (l + dis) * 2 + 3 / 2 * l;
                // this.scene.add(group);
            }
            if (i < this.table.length - 1) {
                for (var j = 0; j < 4; j++) {
                    var mat = passMats[(i * 3 + j) % 2];
                    var mesh = new THREE.Mesh(geometry, mat);
                    mesh.position.x = (i % 2 == 1 ? -(l + dis) * j + -(l + dis) * parseInt(i / 2) * 3 : -(l + dis) * (i / 2).toFixed(0) * 3);
                    mesh.position.z = (i % 2 == 0 ? -(l + dis) * j + -(l + dis) * parseInt(i / 2) * 3 : -(l + dis) * (i / 2).toFixed(0) * 3) + (l / 2 + l + dis + dis / 2);
                    mesh.name = i + '/' + j;
                    mesh.updateMatrix();
                    mesh.matrixAutoUpdate = false;
                    this.scene.add(mesh);
                }
            }
            if (i == this.table.length - 2) {
                var mat = passMats[1];
                var mesh = new THREE.Mesh(geometry, mat);
                var group = this.createGroup(l, 6, 3, mat);
                i % 2 == 1 && group.rotateY(Math.PI / 2)
                group.position.x = (i % 2 == 1 ? -(l + dis) * 3 + -(l + dis) * parseInt(i / 2) * 3 - ((l + dis)*2) : -(l + dis) * (i / 2).toFixed(0) * 3);
                group.position.z = (i % 2 == 0 ? -(l + dis) * 3 + -(l + dis) * parseInt(i / 2) * 3 - ((l + dis)*2) : -(l + dis) * (i / 2).toFixed(0) * 3) + (l / 2 + l + dis + dis / 2);
                // this.scene.add(group);
            }
            var texture = new THREE.TextureLoader().load(this.table[i]['img']);
            var material = new THREE.MeshBasicMaterial({
                side: THREE.FrontSide,
                map: texture,
                transparent: true,
                depthTest: false
            });
            var plane = new THREE.Mesh(planeGeometry, material);
            plane.rotateX(-Math.PI / 2);
            plane.rotateZ(Math.PI / 4);
            plane.scale.x = 1.42;
            plane.scale.y = 1.42;
            // plane.position.y = 4 - i % 2 * 1;
            plane.position.y = 6;
            if (i % 2 == 1) {
                plane.position.x = -2 * (l + dis) - parseInt(i / 2) * 3 * (l + dis);
                plane.position.z = 1 / 2 * (l + dis) - parseInt(i / 2) * 3 * (l + dis);
            } else {
                plane.position.x = 2 * (l + dis) - parseInt(i / 2) * 3 * (l + dis);
                plane.position.z = -1 / 2 * (l + dis) - (i / 2) * 3 * (l + dis);
            }
            if (i == 0) {
                plane.scale.x = 2;
                plane.scale.y = 2;
                // plane.position.x = 2 * (l + dis) - parseInt(i / 2) * 3 * (l + dis) - 2 * l / 3;
                // plane.position.z = -1 / 2 * (l + dis) - (i / 2) * 3 * (l + dis) + l / 2;
                plane.position.x = 0.9*(l + dis) * 3 / 2;
                plane.position.z = 0.9*(l + dis) * 3 / 2;
            }
            if (i == this.table.length - 1) {
                plane.scale.x = 2.3;
                plane.scale.y = 4.2;
                // plane.position.x = 2 * (l + dis) - parseInt(i / 2) * 3 * (l + dis) - 2 * l / 3;
                // plane.position.z = -1 / 2 * (l + dis) - (i / 2) * 3 * (l + dis) + l / 2;
                plane.position.x = plane.position.x - (l + dis) * 3 / 2 - (l + dis)*3;
                plane.position.z = plane.position.z + (l + dis) * 3 / 2 - (l + dis)*3;
            }
            // plane.renderOrder = i;
            this.scene.add(plane);
        }

        /* var geometry = new THREE.PlaneBufferGeometry( 63, 63 );
        var texture = new THREE.TextureLoader().load( "../../chengzhangzhilu/img/1.png" );
        var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,map:texture,transparent:true} );
        var plane = new THREE.Mesh( geometry, material );
        plane.rotateX( -Math.PI / 2 );
        plane.rotateZ( Math.PI / 4 );
        plane.scale.x = 1.1;
        plane.scale.y = 2;
        plane.position.x = -21;
        plane.position.y = 3;
        plane.position.z = -115 + (l/2 + l + dis + dis/2);
        this.scene.add( plane ); */

        // lights

        var light = new THREE.DirectionalLight(0xeeeeee);
        light.position.set(1, 1, -1);
        this.scene.add(light);

        var light = new THREE.DirectionalLight(0xeeeeee);
        light.position.set(-1, 1, 1);
        this.scene.add(light);

        var light = new THREE.AmbientLight(0x333333);
        // this.scene.add(light);
        //
        document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    },
    createGroup: function (l, t, num, material) {
        var group = new THREE.Group();
        for (var i = 0; i < num; i++) {
            var geometry = new THREE.BoxBufferGeometry(l, t, l * (num - i));
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = i * (t + 2);
            // mesh.position.z = i * l / 2 / 2;
            group.add(mesh);
        }
        return group;
    },
    onDocumentTouchStart: function (event) {

        // event.preventDefault();

        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        this.onDocumentMouseDown(event);

    },
    onDocumentMouseDown: function (event) {

        // event.preventDefault();

        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            var name = intersects[0].object.name;
            var result = name.split(/\//g);
            console.log(this.table[result[0]]['info'][result[1]]);
        }
    },
    onWindowResize: function onWindowResize() {
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
        this.render();
    },
    animate: function animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.render();
    },
    render: function render() {
        this.stats.begin();
        this.renderer.render(this.scene, this.camera);
        // console.log(this.camera.position)
        this.stats.end();
    }
});
var wx3d = new WX3D();