import {Injectable} from "../core/decorator/injectable/injectable.decorator";
import {MyDependency} from "./my-dependency";
import {OnInit} from "../core/hooks/on-init";

@Injectable()
export class MyService implements OnInit {
    public constructor(private _dependency: MyDependency) {
        _dependency.execute();
    }

    public onInit(): void {
        console.log("My Service successfully initialized");
    }

    public execute(): void {
        console.log('Hello World from MyService')
    }
}
