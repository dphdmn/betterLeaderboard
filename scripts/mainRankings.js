//rankings that is "main", and custom ranking examples

const rankListMain = [{
    id: "3x3 ao50",
    width: 3,
    height: 3,
    avglen: 50,
    gameMode: "Standard"
},
{
    id: "3x3 ao100",
    width: 3,
    height: 3,
    avglen: 100,
    gameMode: "Standard"
},
{
    id: "3x3 x42",
    width: 3,
    height: 3,
    avglen: 1,
    gameMode: "Marathon 42"
},
{
    id: "4x4 ao12",
    width: 4,
    height: 4,
    avglen: 12,
    gameMode: "Standard"
},
{
    id: "4x4 ao50",
    width: 4,
    height: 4,
    avglen: 50,
    gameMode: "Standard"
},
{
    id: "4x4 ao100",
    width: 4,
    height: 4,
    avglen: 100,
    gameMode: "Standard"
},
{
    id: "4x4 x10",
    width: 4,
    height: 4,
    avglen: 1,
    gameMode: "Marathon 10"
},
{
    id: "5x5 ao5",
    width: 5,
    height: 5,
    avglen: 5,
    gameMode: "Standard"
},
{
    id: "5x5 ao12",
    width: 5,
    height: 5,
    avglen: 12,
    gameMode: "Standard"
},
{
    id: "5x5 relay",
    width: 5,
    height: 5,
    avglen: 1,
    gameMode: "2-N relay"
},
{
    id: "6x6 single",
    width: 6,
    height: 6,
    avglen: 1,
    gameMode: "Standard"
},
{
    id: "6x6 ao5",
    width: 6,
    height: 6,
    avglen: 5,
    gameMode: "Standard"
},
{
    id: "6x6 ao12",
    width: 6,
    height: 6,
    avglen: 12,
    gameMode: "Standard"
},
{
    id: "6x6 relay",
    width: 6,
    height: 6,
    avglen: 1,
    gameMode: "2-N relay"
},
{
    id: "7x7 single",
    width: 7,
    height: 7,
    avglen: 1,
    gameMode: "Standard"
},
{
    id: "7x7 ao5",
    width: 7,
    height: 7,
    avglen: 5,
    gameMode: "Standard"
},
{
    id: "7x7 relay",
    width: 7,
    height: 7,
    avglen: 1,
    gameMode: "2-N relay"
},
{
    id: "8x8 single",
    width: 8,
    height: 8,
    avglen: 1,
    gameMode: "Standard"
},
{
    id: "9x9 single",
    width: 9,
    height: 9,
    avglen: 1,
    gameMode: "Standard"
},
{
    id: "10x10 single",
    width: 10,
    height: 10,
    avglen: 1,
    gameMode: "Standard"
}
];

const customRankButtonsExamples = [{
    "Classic 30": "3x3 ao5, 3x3 ao12, 3x3 ao50, 3x3 ao100, 3x3 x10, 3x3 x42, 4x4 single, 4x4 ao5, 4x4 ao12, 4x4 ao50, 4x4 ao100, 4x4 x10, 4x4 x42, 4x4 relay, 5x5 single, 5x5 ao5, 5x5 ao12, 5x5 ao50, 5x5 relay, 6x6 single, 6x6 ao5, 6x6 ao12, 6x6 relay, 7x7 single, 7x7 ao5, 7x7 relay, 8x8 single, 8x8 ao5, 9x9 single, 10x10 single"
},
{
    "Extended 100": "3x3 ao5, 3x3 ao12, 3x3 ao50, 3x3 ao100, 3x3 x5, 3x3 x10, 3x3 x42, 3x3 x100, 3x3 rel-ao5, 3x3 rel-ao12, 3x3 Wrel-ao5, 3x3 Wrel-ao12, 3x3 Hrel-ao5, 3x3 Hrel-ao12, 3x3 Eut-ao5, 3x3 Eut-ao12, 3x3 Eut-ao50, 4x4 single, 4x4 ao5, 4x4 ao12, 4x4 ao50, 4x4 ao100, 4x4 x5, 4x4 x10, 4x4 x42, 4x4 x100, 4x4 relay, 4x4 rel-ao5, 4x4 rel-ao12, 4x4 Wrel, 4x4 Wrel-ao5, 4x4 Wrel-ao12, 4x4 Hrel, 4x4 Hrel-ao5, 4x4 Hrel-ao12, 4x4 Eut, 4x4 Eut-ao5, 4x4 Eut-ao12, 5x5 single, 5x5 ao5, 5x5 ao12, 5x5 ao50, 5x5 ao100, 5x5 x5, 5x5 x10, 5x5 x42, 5x5 relay, 5x5 rel-ao5, 5x5 rel-ao12, 5x5 Wrel, 5x5 Wrel-ao5, 5x5 Wrel-ao12, 5x5 Hrel, 5x5 Hrel-ao5, 5x5 Hrel-ao12, 5x5 Eut, 5x5 Eut-ao5, 5x5 Eut-ao12, 6x6 single, 6x6 ao5, 6x6 ao12, 6x6 ao50, 6x6 ao100, 6x6 x5, 6x6 x10, 6x6 relay, 6x6 rel-ao5, 6x6 Wrel, 6x6 Wrel-ao5, 6x6 Hrel, 6x6 Hrel-ao5, 6x6 Eut, 6x6 Eut-ao5, 7x7 single, 7x7 ao5, 7x7 ao12, 7x7 ao50, 7x7 x5, 7x7 relay, 7x7 rel-ao5, 7x7 Wrel, 7x7 Wrel-ao5, 7x7 Hrel, 7x7 Hrel-ao5, 8x8 single, 8x8 ao5, 8x8 ao12, 8x8 x5, 8x8 relay, 8x8 Wrel, 8x8 Hrel, 9x9 single, 9x9 ao5, 9x9 relay, 10x10 single, 10x10 ao5, 10x10 relay, 12x12 single, 16x16 single, 20x20 single"
},
{
    "11x11 - 20x20 singles": "11x11, 12x12, 13x13, 14x14, 15x15, 16x16, 17x17, 18x18, 19x19, 20x20"
},
{
    "6x6 - 10x10 singles": "6x6, 7x7, 8x8, 9x9, 10x10"
},
{
    "Classic Old Kinch": "3x3 ao100, 4x4 ao50, 5x5 ao12, 6x6 ao5, 7x7, 8x8, 10x10"
},
{
    "NxM <= 10x10": "2x6, 2x7, 2x8, 2x9, 2x10, 3x4, 3x5, 3x6, 3x7, 3x8, 3x9, 3x10, 4x3, 4x4, 4x5, 4x6, 4x7, 4x8, 4x9, 4x10, 5x2, 5x3, 5x4, 5x5, 5x6, 5x7, 5x8, 5x9, 5x10, 6x2, 6x3, 6x4, 6x5, 6x6, 6x7, 6x8, 6x9, 6x10, 7x2, 7x3, 7x4, 7x5, 7x6, 7x7, 7x8, 7x9, 7x10, 8x2, 8x3, 8x4, 8x5, 8x6, 8x7, 8x8, 8x9, 8x10, 9x2, 9x3, 9x4, 9x5, 9x6, 9x7, 9x8, 9x9, 9x10, 10x2, 10x3, 10x4, 10x5, 10x6, 10x7, 10x8, 10x9, 10x10"
},
{
    "NxM product <= 100": "5x2, 2x6, 3x4, 4x3, 6x2, 2x7, 7x2, 3x5, 5x3, 2x8, 4x4, 8x2, 2x9, 3x6, 6x3, 9x2, 2x10, 4x5, 5x4, 10x2, 3x7, 7x3, 2x11, 11x2, 2x12, 3x8, 4x6, 6x4, 8x3, 12x2, 5x5, 2x13, 13x2, 3x9, 9x3, 2x14, 4x7, 7x4, 14x2, 2x15, 3x10, 5x6, 6x5, 10x3, 15x2, 2x16, 4x8, 8x4, 16x2, 3x11, 11x3, 2x17, 17x2, 5x7, 7x5, 2x18, 3x12, 4x9, 6x6, 9x4, 12x3, 18x2, 2x19, 19x2, 3x13, 13x3, 2x20, 4x10, 5x8, 8x5, 10x4, 20x2, 2x21, 3x14, 6x7, 7x6, 14x3, 21x2, 2x22, 4x11, 11x4, 22x2, 3x15, 5x9, 9x5, 15x3, 2x23, 23x2, 2x24, 3x16, 4x12, 6x8, 8x6, 12x4, 16x3, 24x2, 7x7, 2x25, 5x10, 10x5, 25x2, 3x17, 17x3, 2x26, 4x13, 13x4, 26x2, 2x27, 3x18, 6x9, 9x6, 18x3, 27x2, 5x11, 11x5, 2x28, 4x14, 7x8, 8x7, 14x4, 28x2, 3x19, 19x3, 2x29, 29x2, 2x30, 3x20, 4x15, 5x12, 6x10, 10x6, 12x5, 15x4, 20x3, 30x2, 2x31, 31x2, 3x21, 7x9, 9x7, 21x3, 2x32, 4x16, 8x8, 16x4, 32x2, 5x13, 13x5, 2x33, 3x22, 6x11, 11x6, 22x3, 33x2, 2x34, 4x17, 17x4, 34x2, 3x23, 23x3, 2x35, 5x14, 7x10, 10x7, 14x5, 35x2, 2x36, 3x24, 4x18, 6x12, 8x9, 9x8, 12x6, 18x4, 24x3, 36x2, 2x37, 37x2, 3x25, 5x15, 15x5, 25x3, 2x38, 4x19, 19x4, 38x2, 7x11, 11x7, 2x39, 3x26, 6x13, 13x6, 26x3, 39x2, 2x40, 4x20, 5x16, 8x10, 10x8, 16x5, 20x4, 40x2, 3x27, 9x9, 27x3, 2x41, 41x2, 2x42, 3x28, 4x21, 6x14, 7x12, 12x7, 14x6, 21x4, 28x3, 42x2, 5x17, 17x5, 2x43, 43x2, 3x29, 29x3, 2x44, 4x22, 8x11, 11x8, 22x4, 44x2, 2x45, 3x30, 5x18, 6x15, 9x10, 10x9, 15x6, 18x5, 30x3, 45x2, 7x13, 13x7, 2x46, 4x23, 23x4, 46x2, 3x31, 31x3, 2x47, 47x2, 5x19, 19x5, 2x48, 3x32, 4x24, 6x16, 8x12, 12x8, 16x6, 24x4, 32x3, 48x2, 2x49, 7x14, 14x7, 49x2, 3x33, 9x11, 11x9, 33x3, 2x50, 4x25, 5x20, 10x10, 20x5, 25x4, 50x2"
},
{
    "Simplified 3x3 - 10x10": "3x3 ao12, 3x3 ao50, 3x3 ao100, 4x4 ao5, 4x4 ao12, 4x4 ao50, 5x5 ao5, 5x5 ao12, 6x6 single, 6x6 ao5, 6x6 ao12, 7x7 single, 7x7 ao5, 8x8 single, 9x9 single, 10x10 single"
},
{
    "4x4 - 50x50 singles": "4x4, 5x5, 6x6, 7x7, 8x8, 9x9, 10x10, 11x11, 12x12, 13x13, 14x14, 15x15, 16x16, 17x17, 18x18, 19x19, 20x20, 21x21, 22x22, 23x23, 24x24, 25x25, 26x26, 27x27, 28x28, 29x29, 30x30, 31x31, 32x32, 33x33, 34x34, 35x35, 36x36, 37x37, 38x38, 39x39, 40x40, 41x41, 42x42, 43x43, 44x44, 45x45, 46x46, 47x47, 48x48, 49x49, 50x50"
},
{
    "4x4 - 10x10 Relays": "4x4 rel, 5x5 rel, 6x6 rel, 7x7 rel, 8x8 rel, 9x9 rel, 10x10 rel"
},
];
