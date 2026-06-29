document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("careerForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const btn = document.getElementById("generateBtn");

        btn.disabled = true;
        btn.innerHTML = "Generating Career Plan...";

        const data = {

            name: document.getElementById("name").value,
            education: document.getElementById("education").value,
            field: document.getElementById("field").value,
            interests: document.getElementById("interests").value,
            skills: document.getElementById("skills").value,
            goal: document.getElementById("goal").value

        };

        try {

            const response = await fetch("http://localhost:3000/generate", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            const result = await response.json();

            if(result.success){

                localStorage.setItem("careerReport", JSON.stringify(result.result));

                window.location.href = "results.html";

            }

            else{

                alert(result.message);

            }

        }

        catch(error){

            console.error(error);

            alert("Unable to connect to Gemini.");

        }

        btn.disabled = false;
        btn.innerHTML = "🚀 Generate My Career Plan";

    });

});