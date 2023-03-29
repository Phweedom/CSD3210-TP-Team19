using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BowlingGameplayManager : MonoBehaviour
{
    GameObject bowlingPins;
    Vector3[] bowlingPin_starting_positions = new Vector3[10];

    // Start is called before the first frame update
    void Start()
    {
        // Record bowling pin
        bowlingPins = GameObject.Find("BowlingPins");
        if(bowlingPins != null)
        {
            for(int i = 0; i < 10; ++i)
            {
                bowlingPin_starting_positions[i] = bowlingPins.transform.GetChild(i).transform.position;
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        if(Input.GetKeyDown(KeyCode.R))
        {
            ResetPins();
        }
    }

    public void ResetPins()
    {
        for(int i = 0; i < 10; ++i)
        {
            GameObject pin = bowlingPins.transform.GetChild(i).gameObject;
            pin.transform.position = bowlingPin_starting_positions[i];
            pin.transform.Translate(0, 1, 0);
            pin.transform.rotation = Quaternion.identity;
            pin.GetComponent<Rigidbody>().velocity = Vector3.zero;
            pin.GetComponent<Rigidbody>().angularVelocity = Vector3.zero;
        }
    }
}
