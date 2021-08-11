import { MODULE_NAME } from "./settings.js";
export const WindowDoors = {
    renderWallConfigHandler: function (app, html, data) {
        if (data.object.window === 0) {
            app.setPosition({
                height: 270,
                width: 400,
            });
            return;
        }
        app.setPosition({
            height: 500,
            width: 400,
        });
        const message = `<div class="form-group">
            <div class="form-fields">
              <label>Is Window?</label>
              <select name="window" data-dtype="Number">
                  <option name='flags.${MODULE_NAME}.doorWindow.base0' value="0" selected>None</option>
                  <option name='flags.${MODULE_NAME}.doorWindow.base1' value="1">Window Base</option>
              </select>
            </div>
          </div>`;
        //console.log(html.find('.form-group'));
        // Thanks to Calego#0914 on the League of Extraordinary FoundryVTT Developers
        // Discord server for the jQuery assistance here.
        // Adds form-group and buttons to the correct position on the Wall Config
        html.find('.form-group').last().after(message);
        // buttons
        const windowValue = $('select[name=window] option').filter(':selected').val() == "1";
        const form = document.getElementById('wall-config');
        form.addEventListener('submit', (e) => {
            const nameDefCP = `flags.${MODULE_NAME}.doorWindow.base1`;
            //@ts-ignore
            const wallConfDCD = document.getElementsByName(nameDefCP)[0].value; // TODO HTMLElement property value not mapped
            e.preventDefault();
            // IF IS TYPE 1 => Window Base
            if (wallConfDCD) {
                // TODO Update Wall
            }
        });
    },
    // // Cache default textures on submitting Settings Config
    // // Only really needed if default textures are changed, but as I haven't
    // // yet figured out how to only run on changes, it will just run on every
    // // submission of the settings form.
    // renderSettingsConfigHandler: function(app, html, user){
    //   const form = document.getElementById('client-settings');
    //   form.addEventListener('submit', (e) => {
    //       const nameDefCP = `flags.${MODULE_NAME}.doorWindow.base1`;
    //       //@ts-ignore
    //       const wallConfDCD = document.getElementsByName(nameDefCP)[0].value; // TODO HTMLElement property value not mapped
    //       e.preventDefault();
    //       // TODO Update Wall
    //   });
    // },
};
