export async function generateStudyPlan(data) {
    console.log("Calling backend study-plan/generate API");
    
    // Safely handle environment variables in Vite/React environment
    const BACKEND_URL = "http://localhost:4000"; 
    
    try {
        const res = await fetch(
            `${BACKEND_URL}/study-plan/generate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        
        if (!res.ok) {
            let msg = `Backend returned ${res.status}`;
            try {
                const errBody = await res.json();
                if (errBody.message) msg = errBody.message;
            } catch (e) {}
            throw new Error(msg);
        }
        
        const json = await res.json();
        console.log("Backend Study Plan Response:", json);
        return json;
    } catch (error) {
        console.error("API Call failed:", error);
        throw error;
    }
}