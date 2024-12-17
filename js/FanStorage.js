export class FanStorage {
  static saveToLocalStorage(fans) {
    localStorage.setItem('fansData', JSON.stringify(fans));
    alert('Data saved to local storage!');
  }

  static loadFromLocalStorage() {
    const savedData = localStorage.getItem('fansData');
    return savedData ? JSON.parse(savedData) : null;
  }

  static downloadJson(fans) {
    const jsonString = JSON.stringify(fans, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fans.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  static async loadJsonFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject('Invalid JSON file!');
        }
      };
      reader.readAsText(file);
    });
  }
}