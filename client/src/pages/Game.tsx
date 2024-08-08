import { useEffect, useRef, useState } from "react"
import { BallManager } from "../game/classes/BallManager";
// import axios from "axios";


export default function Game() {
    const [ballManager, setBallManager] = useState<BallManager>();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            const ballManager = new BallManager(canvasRef.current as unknown as HTMLCanvasElement)
            setBallManager(ballManager)
        }
 
    }, [canvasRef])

    return (
        <div style={{display: 'flex'}}>
            <canvas ref={canvasRef} width="800" height="800"></canvas>
            <div>
                <button onClick={async() => {
                    // const response = await axios.post("http://localhost:3000/game", {data: 1});
                    if (ballManager) {
                        ballManager.addBall(3964963.452981615);
                        // ballManager.addBall(response.point);
                    }
                }}>Add ball</button>
            </div>
        </div>
    )
}