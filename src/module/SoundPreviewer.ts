export const SoundPreviewer = {

  previewer : null,

  init : function(){
    this.previewer = new SoundPreviewerApplication();
  },

  start : function(html){
    if(!this.previewer){
      this.init();
    }
    this.previewer.stop();
    html.find('.file').click(ev => {
        const filePath = ev.currentTarget.dataset.path;
        const fileExtension = filePath.substring(filePath.lastIndexOf('.')).slice(1);
        if (CONST.AUDIO_FILE_EXTENSIONS.includes(fileExtension)) {
          this.previewer.play(filePath);
        } else {
          this.previewer.stop();
        }
    });
  },

  stop : function(){
    this.previewer.stop();
  }

}

export class SoundPreviewerApplication extends Application {

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
