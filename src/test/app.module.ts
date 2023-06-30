import {Module} from "../core/decorator/module/module.decorator";
import {MyService} from "./my-service";
import {MyDependency} from "./my-dependency";

@Module({
    providers: [MyService, MyDependency]
})
export class AppModule {}
