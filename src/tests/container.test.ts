import { container } from '@/container';

describe('DependencyContainer', () => {
  afterEach(() => {
    container.reset();
  });

  it('should register and resolve a dependency', () => {
    const mockFactory = jest.fn(() => ({ name: 'TestDependency' }));
    container.register('testDependency', mockFactory);

    const resolvedDependency = container.resolve<{ name: string }>('testDependency');

    expect(resolvedDependency).toEqual({ name: 'TestDependency' });
    expect(mockFactory).toHaveBeenCalledTimes(1);
  });

  it('should reuse singleton instances', () => {
    const mockFactory = jest.fn(() => ({ name: 'SingletonDependency' }));
    container.register('singletonDependency', mockFactory);

    const instance1 = container.resolve<{ name: string }>('singletonDependency');
    const instance2 = container.resolve<{ name: string }>('singletonDependency');

    expect(instance1).toBe(instance2);
    expect(mockFactory).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if dependency is not registered', () => {
    expect(() => container.resolve('nonExistentDependency')).toThrow(
      'Dependency "nonExistentDependency" is not registered.'
    );
  });

  it('should reset a specific dependency', () => {
    const mockFactory = jest.fn(() => ({ name: 'ResetDependency' }));
    container.register('resetDependency', mockFactory);

    const instance1 = container.resolve<{ name: string }>('resetDependency');
    container.reset('resetDependency');

    const instance2 = container.resolve<{ name: string }>('resetDependency');

    expect(instance1).not.toBe(instance2);
    expect(mockFactory).toHaveBeenCalledTimes(2);
  });

  it('should reset all dependencies', () => {
    const mockFactory1 = jest.fn(() => ({ name: 'Dependency1' }));
    const mockFactory2 = jest.fn(() => ({ name: 'Dependency2' }));

    container.register('dependency1', mockFactory1);
    container.register('dependency2', mockFactory2);

    container.resolve('dependency1');
    container.resolve('dependency2');

    container.reset();

    const instance1 = container.resolve<{ name: string }>('dependency1');
    const instance2 = container.resolve<{ name: string }>('dependency2');

    expect(mockFactory1).toHaveBeenCalledTimes(2);
    expect(mockFactory2).toHaveBeenCalledTimes(2);
    expect(instance1).not.toBe(instance2);
  });
});
