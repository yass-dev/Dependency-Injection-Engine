import {YassContainer} from "./core/yass-container/yass-container";
import {AppModule} from "./test/app.module";
import {MyService} from "./test/my-service";

YassContainer.initialize(AppModule);

const myService: MyService = YassContainer.resolve(MyService);
myService.execute();
