"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var astro = __importStar(require("astronomy-engine"));
var date = new Date(Date.UTC(1990, 0, 1, 10, 0, 0));
var astroTime = astro.MakeTime(date);
var vec = astro.GeoVector(astro.Body.Sun, astroTime, true);
// Approach 1: Ecliptic (J2000)
var ecl1 = astro.Ecliptic(vec);
console.log("J2000:", ecl1.elon);
// Approach 2: True Equinox of Date
var rot1 = astro.Rotation_EQJ_EQD(astroTime);
var eqd = astro.RotateVector(rot1, vec);
var rot2 = astro.Rotation_EQD_ECL(astroTime);
var ecl = astro.RotateVector(rot2, eqd);
var sph = astro.SphereFromVector(ecl);
console.log("Date:", sph.lon);
