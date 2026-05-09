document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. EFEK NAVBAR (ANTI ERROR) ===
    const nav = document.getElementById('main-nav');
    const logo = document.getElementById('nav-logo');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md', 'py-4');
                nav.classList.remove('bg-transparent', 'py-6');
                if (logo) { logo.classList.add('text-blue-700'); logo.classList.remove('text-white'); }
                links.forEach(link => { link.classList.add('text-gray-800'); link.classList.remove('text-white'); });
            } else {
                nav.classList.add('bg-transparent', 'py-6');
                nav.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md', 'py-4');
                if (logo) { logo.classList.add('text-white'); logo.classList.remove('text-blue-700'); }
                links.forEach(link => { link.classList.add('text-white'); link.classList.remove('text-gray-800'); });
            }
        }
    });

    // === 2. FUNGSI PENCARIAN (PASTI JALAN) ===
    const container = document.getElementById('country-container');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error-msg');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Pastikan kita berada di halaman yang ada Search Bar-nya
    if (container && searchBtn && searchInput) {
        
        async function fetchDestinations(url) {
            try {
                container.innerHTML = ''; 
                errorMsg.classList.add('hidden');
                loading.classList.remove('hidden');

                const response = await fetch(url);
                if (!response.ok) throw new Error('Data tidak ditemukan');
                
                const data = await response.json();
                loading.classList.add('hidden');
                
                renderCards(data.slice(0, 16)); 
            } catch (error) {
                loading.classList.add('hidden');
                errorMsg.classList.remove('hidden');
            }
        }

        function renderCards(countries) {
            countries.forEach((country, index) => {
                const flagUrl = country.flags.svg;
                const name = country.name.common;
                const capital = country.capital ? country.capital[0] : '-';
                const region = country.region;
                
                // Tambahkan delay animasi supaya munculnya satu-satu (Elegan)
                const animDelay = (index % 4) * 0.1;

                const cardHTML = `
                    <div class="bg-white rounded-2xl overflow-hidden destination-card border border-gray-100 flex flex-col h-full animate-fade-up" style="animation-delay: ${animDelay}s; opacity: 0;">
                        <div class="relative h-48 overflow-hidden group">
                            <img src="${flagUrl}" alt="${name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                ${region}
                            </div>
                        </div>
                        <div class="p-6 flex-grow flex flex-col justify-between">
                            <div>
                                <h4 class="text-xl font-extrabold text-gray-900 mb-2 truncate">${name}</h4>
                                <p class="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <span class="text-blue-500 text-lg">📍</span> Capital: ${capital}
                                </p>
                            </div>
                            <button class="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors duration-300">
                                Explore
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });
        }

        // Event Listener Tombol Cari
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query === '') {
                fetchDestinations('https://restcountries.com/v3.1/all');
            } else {
                fetchDestinations(`https://restcountries.com/v3.1/name/${query}`);
            }
        });

        // Event Listener Tekan "Enter"
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        // Tampilkan semua negara saat halaman pertama kali dibuka
        fetchDestinations('https://restcountries.com/v3.1/all');
    }

    // Dynamic Year
    document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());
});