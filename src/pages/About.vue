<script setup lang="ts">
</script>

<template>
    <div id="about" class="about-container">
        <div class="avatar-wrapper">
            <img class="avatar" src="/res/avator.png" alt="YY. Lee's avatar">
            <div class="divider"></div>
        </div>
        <p class="intro">
            Hello, I'm <strong>YY. Lee</strong> <span class="flag">🇨🇳</span><br>
            Welcome to my personal blog where I share thoughts on technology and life.
        </p>
    </div>
</template>

<style scoped>
.about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 2rem;
    text-align: center;
}

.avatar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 3px solid white;
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.divider {
    width: 20vw;
    height: 2px;
    background: linear-gradient(90deg, transparent, #888, transparent);
    margin: 1rem 0;
}

.intro {
    font-size: 1.4rem;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.intro strong {
    color: #2c3e50;
    font-weight: 600;
}

.flag {
    font-size: 1.2em;
    vertical-align: middle;
    margin-left: 4px;
}

@media (max-width: 768px) {
    .avatar {
        width: 120px;
        height: 120px;
    }
    
    .intro {
        font-size: 1.2rem;
    }
}
</style>