import {Injectable} from "../core/decorator/injectable/injectable.decorator";
import {Inject} from "../core/decorator/inject/inject.decorator";
import {forwardRef} from "../core/utils/forward-ref/forward-ref";
import {MyService} from "./my-service";
import {OnInit} from "../core/hooks/on-init";

@Injectable()
export class MyDependency implements OnInit {
    public constructor(@Inject(forwardRef(() => MyService)) private _svc: MyService) {
        _svc.execute();
    }

    public onInit(): void {
        console.log("My Dependency successfully initialized");
    }

    public execute(): void {
        console.log("Hello World from MyDependency");
    }
}
