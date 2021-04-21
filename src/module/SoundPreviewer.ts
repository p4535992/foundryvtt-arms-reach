export class SoundPreviewer extends Application {

  currentClip:HTMLAudioElement;
  preppedFile:string

  constructor(...args) {
      super(...args);
      this.currentClip = undefined;
      this.preppedFile = undefined;
  }

  play(filePath) {
      if (!this.preppedFile || this.preppedFile != filePath) {
          this.stop();
          this.preppedFile = filePath;
      } else if (this.preppedFile === filePath && !this.currentClip) {
          this.currentClip = new Audio(filePath);
          this.currentClip.addEventListener('ended', () => this.currentClip = undefined);
          this.currentClip.play();
      }
  }

  stop() {
      if (this.currentClip) {
          this.currentClip.pause();
          this.currentClip = undefined;
          this.preppedFile = undefined;
      }
  }
}
