import { TextureResource } from '../map/model/';

export class Constants {

    private static instance: Constants = new Constants();

    constrcuctor() {
        if (Constants.instance) {
            throw new Error("Static class cant be instanced!");
        }

        Constants.instance = this;
    }

    public static getInstance() {
        return Constants.instance;
    }

    public tileResources: TextureResource[] = [
        new TextureResource("1tile.png", [32, 32]),
        new TextureResource("2tile.png", [32, 32]),
        new TextureResource("3tile.png", [32, 32]),
        new TextureResource("4tile.png", [32, 32]),
        new TextureResource("5tile.png", [32, 32]),
        new TextureResource("6tile.png", [32, 32]),
        new TextureResource("7tile.png", [32, 32]),
        new TextureResource("8tile.png", [32, 32]),
        new TextureResource("9tile.png", [32, 32]),
        new TextureResource("10tile.png", [32, 32]),
        new TextureResource("11tile.png", [32, 32]),
        new TextureResource("12tile.png", [32, 32]),
        new TextureResource("13tile.png", [32, 32]),
        new TextureResource("14tile.png", [32, 32]),
        new TextureResource("15tile.png", [32, 32]),
        new TextureResource("16tile.png", [32, 32]),
        new TextureResource("17tile.png", [32, 32]),
        new TextureResource("18tile.png", [32, 32]),
        new TextureResource("19tile.png", [32, 32]),
        new TextureResource("20tile.png", [32, 32]),
        new TextureResource("21tile.png", [32, 32]),
        new TextureResource("22tile.png", [32, 32]),
        new TextureResource("23tile.png", [32, 32]),
        new TextureResource("24tile.png", [32, 32]),
        new TextureResource("25tile.png", [32, 32]),
        new TextureResource("26tile.png", [32, 32])
    ];

    public uiResources: TextureResource[] = [
        new TextureResource("100ui.png", [256, 128]),
        new TextureResource("101ui.png", [512, 512]),
        new TextureResource("102ui.png", [256, 256]),
        new TextureResource("103ui.png", [256, 256]),
        new TextureResource("104ui.png", [256, 256]),
        new TextureResource("105ui.png", [256, 256]),
        new TextureResource("106ui.png", [256, 256]),
        new TextureResource("107ui.png", [256, 256]),
        new TextureResource("108ui.png", [256, 256]),
        new TextureResource("109ui.png", [256, 256]),
        new TextureResource("110ui.png", [256, 256]),
        new TextureResource("111ui.png", [256, 256]),
        new TextureResource("112ui.png", [256, 256]),
        new TextureResource("113ui.png", [256, 256]),
        new TextureResource("114ui.png", [256, 256]),
        new TextureResource("115ui.png", [256, 256]),
        new TextureResource("116ui.png", [256, 256]),
        new TextureResource("117ui.png", [256, 256]),
        new TextureResource("118ui.png", [256, 256]),
        new TextureResource("119ui.png", [256, 256]),
        new TextureResource("120ui.png", [256, 256]),
        new TextureResource("121ui.png", [256, 256]),
    ];

    public tileSize: [number, number] = [32, 32];
}