import { FanStorage } from './FanStorage.js';

export class FanUI {
  constructor(fanManager) {
    this.fanManager = fanManager;
    this.currentUrlCode = null;
    this.initializeUI();
  }

  initializeUI() {
    this.fanForm = document.getElementById('fanForm');
    this.fanTableBody = document.getElementById('fanTableBody');
    this.deleteButton = document.getElementById('deleteButton');
    this.jsonFileInput = document.getElementById('jsonFile');
    this.errorMessage = document.getElementById('errorMessage');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.fanForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    this.jsonFileInput.addEventListener('change', (e) => this.handleFileInput(e));
    
    // Add drag and drop support for JSON files
    const fileInput = document.querySelector('.file-input');
    fileInput.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileInput.style.borderColor = 'var(--primary-color)';
    });
    
    fileInput.addEventListener('dragleave', () => {
      fileInput.style.borderColor = 'var(--border-color)';
    });
    
    fileInput.addEventListener('drop', (e) => {
      e.preventDefault();
      fileInput.style.borderColor = 'var(--border-color)';
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/json') {
        this.handleFile(file);
      }
    });
  }

  async handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
      await this.handleFile(file);
    }
  }

  async handleFile(file) {
    try {
      const data = await FanStorage.loadJsonFile(file);
      this.fanManager.setFans(data);
      this.renderFanList();
      this.showSuccess('File loaded successfully!');
    } catch (error) {
      this.showError('Invalid JSON file!');
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this.fanForm);
    const urlCode = formData.get('urlCode');

    if (!this.fanManager.isUrlCodeUnique(urlCode, this.currentUrlCode)) {
      this.showError('URL Code already exists. Please use a different one.');
      return;
    }

    const fanData = {
      urlCode: urlCode,
      modelName: formData.get('modelName'),
      fanSize: formData.get('fanSize'),
      fanFinish: formData.get('fanFinish'),
      variations: formData.get('variations').split(',').map(v => v.trim()).filter(v => v),
      related: formData.get('related').split(',').map(r => r.trim()).filter(r => r),
      category: formData.get('category')
    };

    if (this.currentUrlCode) {
      this.fanManager.updateFan(this.currentUrlCode, fanData);
      this.currentUrlCode = null;
      this.deleteButton.style.display = 'none';
      this.showSuccess('Fan updated successfully!');
    } else {
      this.fanManager.addFan(fanData);
      this.showSuccess('Fan added successfully!');
    }

    this.fanForm.reset();
    this.hideError();
    this.renderFanList();
  }

  renderFanList() {
    this.fanTableBody.innerHTML = '';
    this.fanManager.getFans().forEach((fan, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="serial-number">${index + 1}</td>
        <td>${fan.modelName}</td>
        <td>${fan.fanSize}</td>
        <td>${fan.fanFinish}</td>
        <td>${fan.category}</td>
        <td>${fan.urlCode}</td>
        <td>${fan.variations.join(', ')}</td>
        <td>${fan.related.join(', ')}</td>
        <td>
          <button onclick="fanUI.editFan('${fan.urlCode}')" title="Edit">Edit</button>
          <button onclick="fanUI.deleteFan('${fan.urlCode}')" title="Delete">Delete</button>
          <button onclick="fanUI.duplicateFan('${fan.urlCode}')" title="Duplicate">Copy</button>
        </td>
      `;
      this.fanTableBody.appendChild(row);
    });
  }

  editFan(urlCode) {
    const fan = this.fanManager.getFanByUrlCode(urlCode);
    if (fan) {
      this.currentUrlCode = urlCode;
      document.getElementById('urlCode').value = fan.urlCode;
      document.getElementById('modelName').value = fan.modelName;
      document.getElementById('fanSize').value = fan.fanSize;
      document.getElementById('fanFinish').value = fan.fanFinish;
      document.getElementById('variations').value = fan.variations.join(', ');
      document.getElementById('related').value = fan.related.join(', ');
      document.getElementById('category').value = fan.category;
      this.deleteButton.style.display = 'inline';
    }
  }

  deleteFan(urlCode) {
    if (confirm('Are you sure you want to delete this fan?')) {
      this.fanManager.deleteFan(urlCode);
      this.renderFanList();
      this.showSuccess('Fan deleted successfully!');
    }
  }

  duplicateFan(urlCode) {
    this.fanManager.duplicateFan(urlCode);
    this.renderFanList();
    this.showSuccess('Fan duplicated successfully!');
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
    setTimeout(() => this.hideError(), 5000);
  }

  hideError() {
    this.errorMessage.style.display = 'none';
  }

  showSuccess(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    document.querySelector('.container').appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
  }
}