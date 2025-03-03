class App {
    constructor() {
        this.video = document.querySelector('#video');
        
        
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(() => this.startVideo()); 

       
        this.video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video)
            document.body.append(canvas)
            const displaySize = {
                width: this.video.width,
                height: this.video.height
            }
            faceapi.matchDimensions(canvas,displaySize)
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions(); 
                
                const resizedDetections = faceapi.resizeResults(detections,displaySize)
                canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
                faceapi.draw.drawDetections(canvas,resizedDetections)
                faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
                faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
            }, 100);
        });
    }

    startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                this.video.srcObject = stream;
            })
            .catch(err => {
                console.error(err);
            });
    }
}

const runApp = new App();
