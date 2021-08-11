import DirectoryPicker from "./DirectoryPicker.js";
/**
 * Game Settings: SoundPicker
 * @href https://github.com/MrPrimate/vtta-tokenizer/blob/master/src/libs/ImagePicker.js
 */
class SoundPicker extends FilePicker {
    constructor(options = {}) {
        super(options);
    }
    _onSubmit(event) {
        event.preventDefault();
        const path = event.target.file.value;
        const activeSource = this.activeSource;
        const bucket = event.target.bucket ? event.target.bucket.value : null;
        //@ts-ignore
        this.field.value = SoundPicker.format({
            activeSource,
            bucket,
            path,
        });
        this.close();
    }
    static async uploadToPath(path, file) {
        const options = DirectoryPicker.parse(path);
        return FilePicker.upload(options.activeSource, options.current, file, { bucket: options.bucket });
    }
    // returns the type "Sound" for rendering the SettingsConfig
    static Sound(val) {
        return val == null ? '' : String(val);
    }
    // formats the data into a string for saving it as a GameSetting
    static format(value) {
        return value.bucket !== null
            ? `[${value.activeSource}:${value.bucket}] ${value.path}`
            : `[${value.activeSource}] ${value.path}`;
    }
    // parses the string back to something the FilePicker can understand as an option
    static parse(inStr) {
        const str = inStr ?? '';
        let matches = str.match(/\[(.+)\]\s*(.+)?/u);
        if (matches) {
            let [, source, current = ''] = matches;
            current = current.trim();
            const [s3, bucket] = source.split(":");
            if (bucket !== undefined) {
                return {
                    activeSource: s3,
                    bucket: bucket,
                    current: current,
                };
            }
            else {
                return {
                    activeSource: s3,
                    bucket: null,
                    current: current,
                };
            }
        }
        // failsave, try it at least
        return {
            activeSource: "data",
            bucket: null,
            current: str,
        };
    }
    // Adds a FilePicker-Simulator-Button next to the input fields
    static processHtml(html) {
        $(html)
            .find(`input[data-dtype="Sound"]`)
            .each(function () {
            if (!$(this).next().length) {
                let picker = new SoundPicker({
                    field: $(this)[0],
                    //@ts-ignore
                    ...SoundPicker.parse(this.value),
                });
                // data-type="sound" data-target="sound"
                let pickerButton = $('<button type="button" class="file-picker" title="Pick sound"><i class="fas fa-file-import fa-fw"></i></button>');
                pickerButton.on("click", function () {
                    picker.render(true);
                });
                $(this).parent().append(pickerButton);
            }
        });
    }
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        // remove unnecessary elements
        $(html).find("footer button").text("Select Sound");
    }
}
Hooks.on("renderSettingsConfig", (app, html, user) => {
    SoundPicker.processHtml(html);
});
export default SoundPicker;
