import { lightbulb } from '../types';

class LightbulbDiscoveryService {
  public async connectToHub(hubIP?: string): Promise<string> {
    console.log(hubIP);
    if (hubIP) {
      return await fetch(`http://${hubIP}/api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          devicetype: 'swiatla',
        }),
      })
        .then((response) => {
          return response.json().then((response) => {
            if (response[0].error && response[0].error.type === 101) {
              return 'bridge button not pressed';
            }

            localStorage.setItem('hue_username', response[0].success.username);
            localStorage.setItem('hue_bridge_ip', hubIP);
            return 'connected';
          });
        })
        .catch((error) => {
          console.log('Connection error: ', error);
          return 'not ok';
        });
    } else {
      return 'not ok';
    }
  }

  public async discoverLightbulbs(
    hubIP: string,
    username: string,
  ): Promise<lightbulb[]> {
    return fetch(`http://${hubIP}/api/${username}/lights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json().then((response) => {
          const lightbulbs: lightbulb[] = Object.entries(response).map(
            ([id, lightbulb]: [string, any]) => {
              return {
                id: parseInt(id),
                name: lightbulb.name,
                state: lightbulb.state.on,
              };
            },
          );

          return lightbulbs;
        });
      })
      .catch((error) => {
        console.log('Lights discovery error: ', error);
        return [];
      });
  }
}

export default new LightbulbDiscoveryService();
