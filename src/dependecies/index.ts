import controllerDependecy from './controller.dependecy';
import globalDependecy from './global.dependecy';
import repositoryDependecy from './repository.dependecy';
import usecaseDependecy from './usecase.dependecy';

export default function () {
  repositoryDependecy();
  usecaseDependecy();
  controllerDependecy();
  globalDependecy();
}
