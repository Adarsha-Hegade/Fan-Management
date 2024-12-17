import { FanManager } from './FanManager.js';
import { FanStorage } from './FanStorage.js';
import { FanUI } from './FanUI.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const fanManager = new FanManager();
  const fanUI = new FanUI(fanManager);
  
  // Set up global access for UI
  window.fanUI = fanUI;
  
  // Set up buttons
  document.getElementById('saveToLocalStorage').addEventListener('click', () => {
    FanStorage.saveToLocalStorage(fanManager.getFans());
  });
  
  document.getElementById('downloadJson').addEventListener('click', () => {
    FanStorage.downloadJson(fanManager.getFans());
  });
  
  // Load initial data from localStorage
  const savedData = FanStorage.loadFromLocalStorage();
  if (savedData) {
    fanManager.setFans(savedData);
    fanUI.renderFanList();
  }
});