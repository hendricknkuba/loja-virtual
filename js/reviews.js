// Estrutura para armazenar avaliações no localStorage
const productReviews = JSON.parse(localStorage.getItem('productReviews')) || {};

// Função para inicializar o sistema de avaliações
function initReviewSystem(productId) {
    // Carrega as avaliações existentes
    loadReviews(productId);

    // Configura o evento de clique nas estrelas
    setupStarRating();

    // Configura o envio do formulário
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview(productId);
    });
}

// Configura a seleção de estrelas
function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            document.getElementById('ratingValue').value = value;

            // Atualiza a exibição visual
            stars.forEach((s, index) => {
                s.style.color = index < value ? '#ffc107' : '#ccc';
            });
        });
    });
}

// Submete uma nova avaliação
function submitReview(productId) {
    const rating = parseInt(document.getElementById('ratingValue').value);
    const text = document.getElementById('reviewText').value.trim();
    const name = document.getElementById('reviewerName').value.trim();

    if (rating === 0) {
        alert('Por favor, selecione uma classificação com estrelas');
        return;
    }

    if (!text || !name) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Cria o objeto de avaliação
    const review = {
        id: Date.now(), // ID único baseado no timestamp
        productId: productId,
        rating: rating,
        text: text,
        name: name,
        date: new Date().toLocaleDateString()
    };

    // Adiciona ao armazenamento
    if (!productReviews[productId]) {
        productReviews[productId] = [];
    }
    productReviews[productId].push(review);

    // Salva no localStorage
    localStorage.setItem('productReviews', JSON.stringify(productReviews));

    // Recarrega as avaliações
    loadReviews(productId);

    // Limpa o formulário
    document.getElementById('reviewForm').reset();
    document.querySelectorAll('.star-rating .star').forEach(star => {
        star.style.color = '#ccc';
    });

    alert('Avaliação enviada com sucesso!');
}

// Carrega e exibe as avaliações
function loadReviews(productId) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';

    if (!productReviews[productId] || productReviews[productId].length === 0) {
        reviewsList.innerHTML = '<p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>';
        return;
    }

    // Calcula a média de avaliações
    const averageRating = calculateAverageRating(productId);
    updateAverageRatingDisplay(averageRating, productReviews[productId].length);

    // Exibe cada avaliação
    productReviews[productId].forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">${review.date}</span>
                <div class="review-rating">${renderStars(review.rating)}</div>
            </div>
            <div class="review-text">${review.text}</div>
        `;
        reviewsList.appendChild(reviewElement);
    });
}

// Calcula a média de avaliações
function calculateAverageRating(productId) {
    if (!productReviews[productId]) return 0;

    const reviews = productReviews[productId];
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
}

// Atualiza a exibição da média
function updateAverageRatingDisplay(average, count) {
    const averageElement = document.querySelector('.average-rating');
    const countElement = document.querySelector('.rating-count');

    if (averageElement && countElement) {
        averageElement.innerHTML = renderStars(average);
        countElement.textContent = `(${count} avaliações)`;
    }
}

// Função para renderizar estrelas (reutilizável)
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }

    if (hasHalfStar) {
        stars += '½';
    }

    // Preenche com estrelas vazias
    const totalStars = fullStars + (hasHalfStar ? 1 : 0);
    for (let i = totalStars; i < 5; i++) {
        stars += '☆';
    }

    return stars;
}