import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gltf_loader = new GLTFLoader();
const texutre_loader = new THREE.TextureLoader();


export function createAssetInstance(type, x, y, data) {
    if (type in assets) {
        return assets[type](x, y, data);
    } else {
        console.warn(`Asset Type ${type} is not found.`);
        return undefined;
    }
}


const assets = {
    "cube": (x, y) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x339933 }); // マテリアルを設定（赤色）
        const mesh = new THREE.Mesh(geometry, material); // メッシュを作成
        mesh.userData = { id: "cube", x, y };
        mesh.position.set(x, -0.5, y);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },
    "skydoom": async(x,y) =>{
        const texture = await texutre_loader.loadAsync('./texture/skydoom.jpg');;
        const geometry = new THREE.SphereGeometry(30, 32, 16);
        const material = new THREE.MeshLambertMaterial({ 
            side: THREE.BackSide,
            map: texture 
        }); // マテリアルを設定（赤色）
        const mesh = new THREE.Mesh(geometry, material); // メッシュを作成
        mesh.userData = { id: "skydoom", x, y };
        mesh.position.set(x, 40, y);
        return mesh;
    },
    "hormuz": async (x, y) => {
        const gltf = await gltf_loader.loadAsync('./model/hormuz2.glb');
        gltf.scene.position.set(x, 0, y)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) { 
                node.castShadow = true; 
                node.receiveShadow = true;
            }
        });
        return gltf.scene 
    },
}