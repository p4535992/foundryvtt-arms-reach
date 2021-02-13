/**
 * An icon representing a Door Control
 * @class
 * @extends PIXI.Container
 * @memberof PIXI
 */
declare class DoorControl extends PIXI.Container {

    wall: any;
  
    /**
     * Draw the DoorControl icon, displaying it's icon texture and border
     * @return {Promise<DoorControl>}
     */
    draw(): Promise<DoorControl>;
  
    /**
     * Get the icon texture to use for the Door Control icon based on the door state
     * @type {string}
     */
    _getTexture():string;
  
    /* -------------------------------------------- */
    
    reposition(): void;
  
    /* -------------------------------------------- */
    /**
     * Determine whether the DoorControl is visible to the calling user's perspective.
     * The control is always visible if the user is a GM and no Tokens are controlled.
     *
     * @see {SightLayer#testVisibility}
     * @type {boolean}
     */
    get isVisible(): boolean;
  
    /* -------------------------------------------- */
    /*  Event Handlers                              */
    /* -------------------------------------------- */
  
    public _onMouseOver(event: Event): void;
  
    /* -------------------------------------------- */
  
    public _onMouseOut(event: Event): void;
  
    /* -------------------------------------------- */
    /**
     * Handle left mouse down events on the door control icon.
     * This should only toggle between the OPEN and CLOSED states.
     * @param event
     * @private
     */
    public _onMouseDown(event: Event): void;
  
    /* -------------------------------------------- */
    /**
     * Handle right mouse down events on the door control icon
     * This should toggle whether the door is LOCKED or CLOSED
     * @param event
     * @private
     */
    public _onRightDown(event: Event): void;
  
  }