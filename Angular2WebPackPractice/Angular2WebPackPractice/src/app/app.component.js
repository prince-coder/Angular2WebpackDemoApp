"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('./app.loader.ts');
var core_1 = require('@angular/core');
var global_state_1 = require('./global.state');
var services_1 = require('./theme/services');
var theme_constants_1 = require('./theme/theme.constants');
/*
 * App Component
 * Top Level Component
 */
var App = (function () {
    function App(_state, _imageLoader, _spinner) {
        var _this = this;
        this._state = _state;
        this._imageLoader = _imageLoader;
        this._spinner = _spinner;
        this.isMenuCollapsed = false;
        this._loadImages();
        this._state.subscribe('menu.isCollapsed', function (isCollapsed) {
            _this.isMenuCollapsed = isCollapsed;
        });
    }
    App.prototype.ngAfterViewInit = function () {
        var _this = this;
        // hide spinner once all loaders are completed
        services_1.BaThemePreloader.load().then(function (values) {
            _this._spinner.hide();
        });
    };
    App.prototype._loadImages = function () {
        // register some loaders
        services_1.BaThemePreloader.registerLoader(this._imageLoader.load(theme_constants_1.layoutPaths.images.root + 'sky-bg.jpg'));
    };
    App = __decorate([
        core_1.Component({
            selector: 'app',
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [require('normalize.css'), require('./app.scss')],
            template: "\n    <main [ngClass]=\"{'menu-collapsed': isMenuCollapsed}\" baThemeRun>\n      <div class=\"additional-bg\"></div>\n      <router-outlet></router-outlet>\n    </main>\n  "
        }), 
        __metadata('design:paramtypes', [global_state_1.GlobalState, services_1.BaImageLoaderService, services_1.BaThemeSpinner])
    ], App);
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.component.js.map