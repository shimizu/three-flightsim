import { createScene } from "./scene.js";


// ウィンドウがロードされたときに新しいゲームを作成する
window.onload = () => {
    window.game = createGame();
}

export function createGame() {
    let isPaused = false;

    //シーンを作る
    const scene = createScene();
    
    //シーンの初期化
    scene.initialize();

    //マウスイベントをバインド
    document.addEventListener('wheel', scene.controller.onMouseScroll, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);

    //キーイベントをバインド
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    //リサイズイベントをバインド
    window.addEventListener('resize', scene.onResize, false);

    // コンテキストメニューがポップアップしないようにする
    document.addEventListener('contextmenu', (event) => event.preventDefault(), false);

    
    //ゲームのメインループ
    function update() {
        if (isPaused) return;

        //シーンをアップデート
        scene.update();
    }
    

    // 最後にマウスを動かした時間
    let lastMove = new Date();

    //最後にキーを押した時間
    let lastPUsh = new Date();

     //マウスダウン `mousedown` イベントハンドラ
    function onMouseDown(event) {
        // Check if left mouse button pressed
        if (event.button === 0) {
            //マウスカーソル下のオブジェクトを検出する
            const selectedObject = scene.getSelectedObject(event);
            if (selectedObject){
                console.log(selectedObject);
            }
        }
    };

    //mousemove'イベントハンドラ
    function onMouseMove(event) {
        // イベント・ハンドラをスロットルし、ブラウザを停止させないようにする。
        if (Date.now() - lastMove < (1 / 60.0)) return;
        lastMove = Date.now();

        //カメラを回転させる
        scene.controller.onMouseMove(event);
    }


    function onKeyDown(event){
        // イベント・ハンドラをスロットルし、ブラウザを停止させないようにする。
        if (Date.now() - lastPUsh < (1 / 60.0)) return;
        lastPUsh = Date.now();

        scene.controller.onKeyDown(event);
    }

    function onKeyUp(event){
        scene.controller.onKeyUp(event);
    }

    // Start update interval
    setInterval(() => {
        game.update();
    }, 1000)

    // Start the renderer
    scene.start();

    return {
        update,
    };

}