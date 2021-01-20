let mnist,predict,clear,answer
const R = 10
const K = 500
function preload() {
  mnist = loadTable("./data/mnist_train.csv")
}

function setup() {
  createCanvas(28*R,28*R)
  background(0)
  createElement("br")
  createElement("br")
  predict = createButton("predict")
  predict.mousePressed(predict_number)
  clear   = createButton("clear Canvas")
  clear.mousePressed(clear_canvas)
  createElement("br")
  answer = createElement("h3","The answer is : "+"_")
  mnist = mnist.getArray()
}

function draw() {
  if(mouseIsPressed){
    strokeWeight(22)
    stroke(255)
    line(pmouseX,pmouseY,mouseX,mouseY)
  }
}

function clear_canvas(){
  background(0)
  answer.html("The answer is : "+"_")
}

function predict_number(){
  loadPixels()
  let img = []
  for(let i = 0; i < pixels.length; i = i + 4){
    img.push(pixels[i])
  }
  let new_img = center_image(img)
  let res_img = resize_image(new_img)
  let neighbours = calculate_distance(res_img)
  let knn = neighbours.slice(0,K);
  let occ = new Array(10).fill(0)
  for (let i = 0;i<knn.length;i++){
    occ[knn[i][1]]++
  }
  let prediction = occ.indexOf(max(occ))
  answer.html("The answer is : " + prediction)
}

function center_image(img){
  let x,y
  let comX = 0 // the x of the center of mass
  let comY = 0 // the y of the center of mass
  let sumP = 0 // the sum of pixels
  for(let i = 0 ; i < img.length ; i++){
    x = i % width
    y = floor(i / height)
    comX = comX + img[i]*x
    comY = comY + img[i]*y
    sumP = sumP + img[i]
  }
  comX = round(comX/sumP)
  comY = round(comY/sumP)
  let dX = width/2  - comX  // the distance between the center of mass and the center of the image
  let dY = height/2 - comY  // the distance between the center of mass and the center of the image
  let new_img = new Array(width*height).fill(0);
  for(let i = 0 ; i < img.length ; i++){
    x = i % width + dX
    y = floor(i / height) + dY
    if ((x >= width) || (y >= height)){
      continue
    }else{
      let j = x + y*width
      new_img[j] = img[i]
    }
  }
  return new_img
}

function resize_image(img){
  let new_img = new Array(28*28).fill(0)
  for(let i = 0; i<img.length/height; i = i + R){
    for(let j = 0; j<img.length/width; j = j + R){
      for(let j_ = j;j_ < j+R;j_++){
        for(let i_ = i;i_ < i+R;i_++){
          new_img[i/R + 28*(j/R)] = new_img[i/R + 28*(j/R)] + img[i_ + j_*width]
        }
      }
      new_img[i/R + 28*(j/R)] = new_img[i/R + 28*(j/R)]/(R*R)
    }
  }
  return new_img
}

function calculate_distance(img){
  neighbours = []
  for(let ei = 0 ; ei < mnist.length ; ei++){
    let distance = 0
    for(var i = 1 ; i < mnist[ei].length; i++){
        let t = (img[i-1] - mnist[ei][i])
        distance = distance + t*t
    }
    neighbours.push([distance , mnist[ei][0]])
  }
  neighbours.sort(function(a,b){return a[0] - b[0]})
  return neighbours
}
