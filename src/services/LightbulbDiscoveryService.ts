import { lightbulb } from '../types';

class LightbulbDiscoveryService {
  public async connectToHub(hubIP?: string): Promise<void> {
    console.log(hubIP);
    if (hubIP) {
      fetch(`http://${hubIP}/api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          devicetype: 'swiatla',
        }),
      }).then((response) => {
        response.json().then((response) => {
          console.log(response);
        });
      });
    }
  }

  public async discoverLightbulbs(): Promise<lightbulb[]> {
    return Promise.resolve([
      {
        id: 1,
        name: 'Lightbulb 1',
        state: false,
      },
      {
        id: 2,
        name: 'Lightbulb 2',
        state: false,
      },
      {
        id: 3,
        name: 'Lightbulb 3',
        state: true,
      },
      {
        id: 4,
        name: 'Lightbulb 4',
        state: false,
      },
    ]);
  }
}

export default new LightbulbDiscoveryService();
