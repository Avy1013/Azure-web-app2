document.addEventListener("DOMContentLoaded", function () {
    const manhwaList = document.getElementById('manhwa-list');

    // Fetch data from the server
    fetch('/manhwa')
        .then(response => response.json())
        .then(manhwaData => {
            // Function to display manhwa
            manhwaData.forEach(manhwa => {
                const card = document.createElement('div');
                card.classList.add('manhwa-card');

                card.innerHTML = `
                    <img src="${manhwa.image_url}" alt="${manhwa.title}">
                    <h3>${manhwa.title}</h3>
                    <p><strong>Genre:</strong> ${manhwa.genre}</p>
                    <p>${manhwa.description}</p>
                `;

                manhwaList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching manhwa data:', error);
            manhwaList.innerHTML = '<p>Error loading manhwa data.</p>';
        });
});







// // app.js
// document.addEventListener("DOMContentLoaded", function () {
//     const manhwaList = document.getElementById('manhwa-list');

//     // Mock data (we'll replace this with actual data from the database later)
//     const manhwaData = [
//         {
//             title: "Solo Leveling",
//             genre: "Action, Fantasy",
//             description: "The story of Sung Jinwoo, the weakest hunter who becomes the strongest.",
//             image: "https://your_blob_storage_url/solo_leveling.png"
//         },
//         {
//             title: "Tower of God",
//             genre: "Adventure, Fantasy",
//             description: "A boy enters a mysterious tower and faces challenges to reach the top.",
//             image: "https://your_blob_storage_url/tower_of_god.png"
//         },
//         // Add more manhwa entries
//     ];

//     // Function to display manhwa
//     manhwaData.forEach(manhwa => {
//         const card = document.createElement('div');
//         card.classList.add('manhwa-card');

//         card.innerHTML = `
//             <img src="${manhwa.image}" alt="${manhwa.title}">
//             <h3>${manhwa.title}</h3>
//             <p><strong>Genre:</strong> ${manhwa.genre}</p>
//             <p>${manhwa.description}</p>
//         `;

//         manhwaList.appendChild(card);
//     });
// });