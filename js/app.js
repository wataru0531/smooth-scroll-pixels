/**************************************************************

***************************************************************/

import { lerp, setTransform } from "./utils.js";

const imagesGrid = document.getElementById("js-imagesGrid");
const scrollContainer = document.getElementById("js-scrollContainer");

let images = [];

let currentY = 0;
let targetY = 0;
const ease = 0.1; // lerpの補完係数
let height; // bodyの高さ
let timerId = null; // リサイズ処理時のsetTimeoutのid


// EventListener
window.addEventListener("DOMContentLoaded", () => {
  generateImages(); // 画像生成、ピクセルブロック生成

  getBodyHeight(); // bodyの高さを取得
  
  render(); // RAF処理でレンダリング
})

// → リサイズが止んだ時ののみ_onResizeを発火させる
window.addEventListener("resize", () => {
  // console.log("resize");
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done");

    _onResize();
  }, 300);
});



// Functions

// Add Images
// → 画像生成、ピクセルブロック生成
function generateImages(){
  for (let i = 0; i < 6; i++) {
    let imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.style.gridRowStart = i + 1; // 行の位置
    // grid-row-start
    // → グリッド・レイアウトの中でアイテムを配置する祭に行方向の開始位置を指定
  
    let image = document.createElement("img");
    image.src = `./images/${i + 1}.webp`;
    images.push(image); // 画像を配列に保持
  
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
  
    let textDiv = document.createElement("div");
    textDiv.innerHTML = `
      <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam vero id voluptatibus aspernatur cupiditate nihil recusandae totam molestias soluta ea fuga eligendi ad, suscipit iure possimus hic maxime praesentium quis.</h3>
    `;
    textDiv.style.gridRowStart = i + 1;
  
    imageWrapper.append(image, overlay); // appendは複数の要素を挿入可能。appendChildは1つまで
    imagesGrid.append(imageWrapper, textDiv);
  
    // 列を指定して、幅の設定も行う
    if (i % 2 == 1) {
      // 剰余演算子 iを2で割った余が1のとき
      // 1, 3, 5 の奇数の画像コンテナの位置
      imageWrapper.style.gridColumnStart = 1;
      imageWrapper.style.gridColumnEnd = 1 + 5;
      // → grid-column: 2 / 7;
  
      // テキストの位置
      textDiv.style.gridColumnStart = 8;
      textDiv.style.gridColumnEnd = 8 + 5;
    } else {
      // 0, 2, 4 の画像コンテナの位置
      imageWrapper.style.gridColumnStart = 8;
      imageWrapper.style.gridColumnEnd = 8 + 5;
      // → grid-column: 8 / 13;
  
      // テキストの位置
      textDiv.style.gridColumnStart = 1;
      textDiv.style.gridColumnEnd = 1 + 5;
    }
  
    // ピクセル生成
    createPixels(imageWrapper);
  }
}

// ピクセル生成
function createPixels(_imageWrapper) {
  let { width, height } = _imageWrapper.getBoundingClientRect();
  // console.log(width ,height) // 画像の横幅と縦幅

  // ピクセルの位置を決める
  // 20pxづつxの値をループさせて、そのxの値に対してのyの値を決める
  // ループの限界値は画像の横幅
  for (let x = 0; x < width; x += 20) {
    // xの位置に対してyの位置を決める
    for (let y = 0; y < height; y += 20) {
      let pixel = document.createElement("div");
      pixel.className = "pixel";

      pixel.style.top = `${y}px`;
      pixel.style.left = `${x}px`;

      _imageWrapper.appendChild(pixel);
    }
  }
}

// リサイズ処理に関する関数を定義
function _onResize() {
  getBodyHeight(); // scrollContainerの高さをbodyに付与
}

// scrollContainerの高さをbodyに付与
function getBodyHeight() {
  // const scrollHeight = scrollContainer.offsetHeight;
  // console.log(scrollHeight); // 2152

  // bodyに高さを持たせることでブラウザがスクロール可能な高さを持つようになります。
  // これは、コンテンツの高さがビューポートの高さよりも大きい場合に、
  // ブラウザがスクロールバーを表示するため。
  // → body内の要素をposition: fixed;で浮かせた場合はスクロールできないが、
  //   bodyに無理矢理に高さを持たせることスクロールできるようにするため
  // document.body.style.height = `${scrollHeight}px`;

  height = scrollContainer.getBoundingClientRect().height;
  document.body.style.height = `${height}px`;
}


// 初期化関数
// → 初期化で使う関数
// function setup() {
//   getBodyHeight();
// }

function render() {
  targetY = window.scrollY;
  // console.log(targetY)
  currentY = lerp(currentY, targetY, ease);
  scrollContainer.style.transform = `translate3d(0, ${-currentY}px, 0)`;

  // 画像パララックス
  for (let i = 0; i < images.length; i++) {
    // parentElement ... .image__container
    let { top, height } = images[i].parentElement.getBoundingClientRect();
    // console.log(top); // 画像ラッパーのブラウザの上端からの距離。動的に変化

    // ビューポートの半分 - 画像の高さの半分 → この値は全ての画像で共通
    // → ビューポートから画像までの高さから、その値*0.1を上げる
    top -= window.innerHeight / 2 - height / 2;
    // console.log(top); // 初期値 ... 0: -162.75, 1: 329.75, 2: 822.75
    images[i].style.transform = `translate3d(0, ${top * 0.1}px, 0)`;
  }

  requestAnimationFrame(render);
}


