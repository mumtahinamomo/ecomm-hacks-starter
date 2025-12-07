export const playDingSound = () => {
  try {
    const audio = new Audio('/sounds/ding.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.log('Audio play failed:', err);
    });
  } catch (error) {
    console.log('Audio initialization failed:', error);
  }
};
