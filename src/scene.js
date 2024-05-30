import * as THREE from 'three';
import { createController } from './controller.js';
import { createAssetInstance } from './assets.js';


export function createScene() {

  const gameWindow = document.querySelector("#render-target");
  const width = gameWindow.clientWidth;
  const height = gameWindow.clientHeight;

  // シーンを生成
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777); // 背景色を設定

  //オブジェクト選択用の変数
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2;

  // カメラを設定
  const controller = createController(gameWindow);

  // レンダラーを設置  
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(width, height); // レンダラーのサイズをウィンドウのサイズに合わせる
  gameWindow.appendChild(renderer.domElement); // レンダラーのDOM要素をゲームウィンドウに追加

  // ライトを設定
  const ambientLight = new THREE.AmbientLight(new THREE.Color("white"), 1.0); // 環境光を白色で設定
  scene.add(ambientLight); // シーンにライトを追加

  async function initialize(){

    const hormuz = await createAssetInstance("hormuz", 0, 50);

    scene.add(hormuz);


    setupLight();
  }

  function update(){

  }

  //ライトをセッティングする
  function setupLight() {
    const sun = new THREE.DirectionalLight(0xf3d29a, 2);
    sun.position.set(10, 5, 4);
    sun.castShadow = true;
    sun.shadow.bias = -0.0005;
    sun.shadow.camera.left = -6.2;
    sun.shadow.camera.right = 6.4;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.01;
    sun.shadow.camera.far = 20;

    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    //const helper = new THREE.CameraHelper(sun.shadow.camera);
    //scene.add(helper)
  }


  // シーンを描画する関数
  function draw() {
    renderer.render(scene, controller.camera); // シーンをレンダラーで描画
  }

  // アニメーションループを開始する関数
  function start() {
    renderer.setAnimationLoop(draw); // draw関数をアニメーションループに設定
  }

  // アニメーションループを停止する関数
  function stop() {
    renderer.setAnimationLoop(null); // アニメーションループを停止
  }

  function onResize(){
    controller.camera.aspect = gameWindow.offsetWidth / gameWindow.offsetHeight;
    controller.camera.updateProjectionMatrix();
    renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  }

 //マウスカーソルの下にあるオブジェクトを取得します。何もない場合はnullを返します
  function getSelectedObject(event) {

    //マウス座標を正規化(マウス座標は0-1になるので2を掛けて-1することで-1から1の座標に正規化される)
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, controller.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      return intersections[0].object;
    } else {
      return null;
    }
  }


  return {
    controller,

    initialize,
    update,
    start,
    stop,
    onResize,
    getSelectedObject,
  }
}
