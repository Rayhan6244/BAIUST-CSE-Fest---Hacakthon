document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.querySelector(
        '.bg-blue-600.w-full.px-4.py-2'
    );
    const heightInput = document.querySelector(
        'input[placeholder="Height (cm)"]'
    );
    const weightInput = document.querySelector(
        'input[placeholder="Weight (kg)"]'
    );
    const bmiUpdateDiv = document.getElementById('bmi-update');

    // Set initial placeholder content
    bmiUpdateDiv.innerHTML = `
        <div class="p-4 bg-gray-100 text-gray-600 rounded-lg text-center">
            Enter height and weight to calculate BMI
        </div>
    `;

    // Function to calculate BMI and update display
    function calculateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        // Input validation
        if (!height || !weight || height <= 0 || weight <= 0) {
            bmiUpdateDiv.innerHTML = `
                <div class="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    Please enter valid height and weight values.
                </div>
            `;
            return;
        }

        // Convert height from cm to meters
        const heightInMeters = height / 100;
        // Calculate BMI
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        // Determine BMI category
        let category = '';
        let categoryColor = '';
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryColor = 'text-yellow-600';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal';
            categoryColor = 'text-green-600';
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            categoryColor = 'text-orange-600';
        } else {
            category = 'Obese';
            categoryColor = 'text-red-600';
        }

        // Update bmi-update div with BMI result
        bmiUpdateDiv.innerHTML = `
            <div class="p-4 bg-white rounded-lg shadow-sm text-center">
                <p class="text-lg font-semibold">Your BMI: ${bmi}</p>
                <p class="${categoryColor}">Category: ${category}</p>
            </div>
        `;
    }

    // Add event listener to the Calculate button
    calculateButton.addEventListener('click', calculateBMI);
});
