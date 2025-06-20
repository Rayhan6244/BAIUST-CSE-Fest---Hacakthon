document.addEventListener('DOMContentLoaded', () => {
    const marathonSection = document.querySelector(
        '#upcoming-marathon .space-y-4'
    );
    const maxRetries = 3;
    let retryCount = 0;

    // Function to fetch marathon data with retry logic
    async function fetchMarathons() {
        try {
            const response = await fetch(
                'https://csefest.srejon.com/api/v1/marathon?lat=23.8103&lon=90.4125',
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP error! Status: ${response.status} (${response.statusText})`
                );
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error('API returned success: false');
            }

            displayMarathons(result.data);
        } catch (error) {
            console.error('Error fetching marathons:', error);
            retryCount++;

            if (retryCount < maxRetries) {
                setTimeout(fetchMarathons, 2000 * retryCount); // Retry after delay (2s, 4s, 6s)
                marathonSection.innerHTML = `
                    <div class="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
                        Retrying to load marathons... (Attempt ${
                            retryCount + 1
                        }/${maxRetries})
                    </div>
                `;
            } else {
                let errorMessage =
                    'Unable to load marathons. Please try again later.';
                if (error.message.includes('Failed to fetch')) {
                    errorMessage =
                        'Network error or API unreachable. Check your connection or try again later.';
                } else if (
                    error.message.includes('403') ||
                    error.message.includes('CORS')
                ) {
                    errorMessage =
                        'Access to the marathon API is restricted. Please contact support.';
                }

                marathonSection.innerHTML = `
                    <div class="p-4 bg-red-100 text-red-700 rounded-lg">
                        ${errorMessage}
                    </div>
                `;
            }
        }
    }

    // Function to display marathons
    function displayMarathons(marathons) {
        if (!marathons || !Array.isArray(marathons) || marathons.length === 0) {
            marathonSection.innerHTML = `
                <div class="p-4 bg-gray-100 text-gray-700 rounded-lg">
                    No upcoming marathons found near your location.
                </div>
            `;
            return;
        }

        marathonSection.innerHTML = marathons
            .map(
                (marathon) => `
            <div class="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">${
                        marathon.name || 'Unnamed Marathon'
                    }</h3>
                    <p class="text-gray-600">Date: ${
                        marathon.date
                            ? new Date(marathon.date).toLocaleDateString()
                            : 'TBD'
                    }</p>
                    <p class="text-gray-600">Location: ${
                        marathon.location || 'TBD'
                    }</p>
                    <p class="text-gray-600">Distance: ${
                        marathon.distance || 'TBD'
                    }</p>
                    <p class="text-gray-600">Registration Fee: ${
                        marathon.registrationFee
                            ? '৳' + marathon.registrationFee
                            : 'TBD'
                    }</p>
                    <p class="text-gray-600">Deadline: ${
                        marathon.registrationDeadline
                            ? new Date(
                                  marathon.registrationDeadline
                              ).toLocaleDateString()
                            : 'TBD'
                    }</p>
                </div>
                <button class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Register
                </button>
            </div>
        `
            )
            .join('');
    }

    // Fetch marathons on page load
    fetchMarathons();
});
