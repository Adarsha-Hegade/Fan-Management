export class FanManager {
  constructor() {
    this.fans = [];
  }

  setFans(fans) {
    this.fans = fans;
  }

  getFans() {
    return this.fans;
  }

  addFan(fan) {
    this.fans.push(fan);
  }

  updateFan(urlCode, updatedFan) {
    this.fans = this.fans.map(f => f.urlCode === urlCode ? updatedFan : f);
  }

  deleteFan(urlCode) {
    this.fans = this.fans.filter(f => f.urlCode !== urlCode);
  }

  getFanByUrlCode(urlCode) {
    return this.fans.find(f => f.urlCode === urlCode);
  }

  isUrlCodeUnique(urlCode, currentUrlCode) {
    return !this.fans.some(fan => fan.urlCode === urlCode && fan.urlCode !== currentUrlCode);
  }

  duplicateFan(urlCode) {
    const fan = this.getFanByUrlCode(urlCode);
    if (fan) {
      const duplicatedFan = {
        ...fan,
        urlCode: `${fan.urlCode}-copy`
      };
      this.addFan(duplicatedFan);
    }
  }
}