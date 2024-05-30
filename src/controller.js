import * as THREE from 'three';

export function createController(gameWindow) {
    const DEG2RAD = Math.PI / 180; // 度をラジアンに変換する定数

    //マウスボタン設定
    const PAN_MOUSE__BUTTON = 2;
    const ROTATE_MOUSE__BUTTON = 1;

    // ウィンドウサイズを取得
    const width = gameWindow.clientWidth;
    const height = gameWindow.clientHeight;

    // カメラの設定値
    const FOV = 75; // 視野角
    const ASPECT = width / height; // アスペクト比
    const NEAR = 0.1; // カメラの手前クリップ面
    const FAR = 3000; // カメラの奥クリップ面

    // カメラの操作に関する制限値と感度
    const MIN_CAMERA_RADIUS = 2; // カメラの最小距離
    const MAX_CAMERA_RADIUS = 200; // カメラの最大距離
    const MIN_CAMERA_ELEVATION = 30; // カメラの最小高度
    const MAX_CAMERA_ELEVATION = 90; // カメラの最大高度
    const AZIMUTH_SENSITIVITY = 0.2;
    const ELEVATION_SENSITIVITY = 0.2;
    const ZOOM_SENSITIVITY = 0.02; // ズーム操作の感度
    const PAN_SENSITIVITY = -0.1; // パン操作の感度

    const Y_AXIS = new THREE.Vector3(0, 1, 0); // Y軸の定義

    const DEFULT_ORIGIN = () => new THREE.Vector3(0, 0, 40); // カメラの原点 書き換えられないように関数化してる
    const DEFULT_RADIUS = 180; // カメラの距離
    const DEFULT_AZIMUTH = 0; // カメラの方位角
    const DEFULT_Elevation = 45; // カメラの仰角

    // カメラを生成
    const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    let cameraOrgin = DEFULT_ORIGIN();
    let cameraRadius = DEFULT_RADIUS;
    let cameraAzimuth = DEFULT_AZIMUTH;
    let cameraElevation = DEFULT_Elevation;

    //キー入力を管理する配列
    let pushKeys = [];


    // 初期位置のカメラの位置を更新
    updateCameraPositon();

    function onKeyDown(event) {
        pushKeys[event.key.toLowerCase()] = true;
        let dx = 0;
        let dy = 0;

        //キーボードでパンさせる
        if (pushKeys["a"] || pushKeys["arrowleft"]) {
            dx = -20;
        }
        if (pushKeys["d"] || pushKeys["arrowright"]) {
            dx = +20;
        }
        if (pushKeys["w"] || pushKeys["arrowup"]) {
            dy = +20;
        }
        if (pushKeys["s"] || pushKeys["arrowdown"]) {
            dy = -20;
        }
        panCamera(dx, dy);
        updateCameraPositon();
        

        //カメラリセット
        if (pushKeys["r"]){
            resetCamera();
        }
        //カメラ回転
        if (pushKeys["z"]) {
            rotateCamera(180, 0);
        }

        console.log("pushKeys", pushKeys)

    }

    function onKeyUp(event) {
        pushKeys[event.key.toLowerCase()] = false;
    }


    // マウスムーブイベントの処理
    function onMouseMove(event) {
        //console.log("mouseMove");
        // カメラの回転を処理する
        if (event.buttons & ROTATE_MOUSE__BUTTON) {
            rotateCamera(event.movementX, event.movementY);
            updateCameraPositon();
        }

        // カメラのパン操作
        if (event.buttons & PAN_MOUSE__BUTTON) {
            panCamera(event.movementX, event.movementY);
            updateCameraPositon();
        }
    }

    /**
     * ホイール`イベントのイベントハンドラ
     * @param {MouseEvent} event Mouse event arguments
     */
    function onMouseScroll(event) {
        
        var factor = 15;
        var mX = (event.clientX / gameWindow.clientWidth) * 2 - 1;
        var mY = -(event.clientY / gameWindow.clientHeight) * 2 + 1;
        var vector = new THREE.Vector3(mX, mY , 0.1);
        vector.unproject(camera);
        vector.sub(camera.position);
        if (event.deltaY < 0) {
            camera.position.addVectors(camera.position, vector.setLength(factor));
        } else {
            camera.position.subVectors(camera.position, vector.setLength(factor));
        }


        const x = camera.position.x;
        const y = camera.position.y;
        const z = camera.position.z;

        cameraOrgin = new THREE.Vector3(x, y, z);

        const translatedX = x - cameraOrgin.x;
        const translatedY = y - cameraOrgin.y;
        const translatedZ = z - cameraOrgin.z;

        const radius = Math.sqrt(translatedX * translatedX + translatedY * translatedY + translatedZ * translatedZ);
        cameraRadius = radius ;
        cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
        
        updateCameraPositon(); 
    }

    //カメラを回転する
    function rotateCamera(dx, dy){
        cameraAzimuth += -(dx * AZIMUTH_SENSITIVITY);
        cameraElevation += (dy * ELEVATION_SENSITIVITY);
        cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
    }

    //カメラをパンする
    function panCamera(dx, dy){
        const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
        const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
        cameraOrgin.add(forward.multiplyScalar(PAN_SENSITIVITY * dy));
        cameraOrgin.add(left.multiplyScalar(PAN_SENSITIVITY * dx));   
    }

    //カメラをリセットする
    function resetCamera(){
        cameraOrgin = DEFULT_ORIGIN();
        cameraRadius = DEFULT_RADIUS;
        cameraAzimuth = DEFULT_AZIMUTH;
        cameraElevation = DEFULT_Elevation;
        updateCameraPositon(); 
    }


    // カメラの位置を更新する関数
    function updateCameraPositon() {
        // カメラのX, Y, Z座標を計算
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.add(cameraOrgin); // カメラの原点を考慮に入れる
        camera.lookAt(cameraOrgin); // カメラが原点を向くように設定
        camera.updateMatrix(); // カメラの行列を更新
    }

    return {
        camera,
        updateCameraPositon,
        onKeyDown,
        onKeyUp,
        onMouseMove,
        onMouseScroll
    };
}
