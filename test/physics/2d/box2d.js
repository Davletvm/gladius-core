/*jshint white: false, strict: false, plusplus: false, onevar: false,
 nomen: false */
/*global gladius: false, document: false, window: false, module: false, start,
 test: false, expect: false, ok: false, notEqual: false, stop, QUnit: false,
 asyncTest: false, equal: false, deepEqual: false */

( function() {

    var engine = null;    

    module('physics/2d/box2d', {
        setup : function() {
            stop();

            var canvas = document.getElementById("test-canvas");
            gladius.create({
                debug : true,
                services : {
                    physics : {
                        src : 'physics/2d/box2d/service',
                        options : {
                            gravity : [0, 0]
                        }
                    }
                }
            }, function(instance) {
                engine = instance;
                start();
            });
        },
        teardown : function() {
            engine = null;
        }
    });
    
    test( 'body definition, default parameters', function() {
        expect( 8 );
        
        var bodyDefinition = engine.physics.resource.BodyDefinition();
        equal( bodyDefinition.get_type(), 
                engine.physics.resource.BodyDefinition.bodyType.DYNAMIC,
                'correct default type' );
        equal( bodyDefinition.get_linearDamping(), 0, 
                'correct default linear damping' );
        equal( bodyDefinition.get_angularDamping(), 0, 
                'correct default angular damping' );
        equal( bodyDefinition.get_fixedRotation(), 0,
                'correct default fixed rotation' );
        equal( bodyDefinition.get_angularVelocity(), 0,
                'correct default angular velocity' );

        var position = bodyDefinition.get_position();
        deepEqual( [position.get_x(), position.get_y()], [0, 0], 
                'correct default position' );
        
        // use === 0 here since we're groping inside the cross-compilation
        // implementation details and comparing against an integer concept
        // of "false"
        ok( bodyDefinition.get_active() === 0, 
                'correct default active state' );
        ok( bodyDefinition.get_awake() === 0,
                'correct default awake state' );
    });
    
    test( 'body definition, all parameters passed', function() {
        expect( 5 );
        
        var bodyDefinition = engine.physics.resource.BodyDefinition({
            type: engine.physics.resource.BodyDefinition.bodyType.STATIC,
            linearDamping: 10,
            angularDamping: 20,
            fixedRotation: true,
            angularVelocity: 10
        });
        equal( bodyDefinition.get_type(), 
                engine.physics.resource.BodyDefinition.bodyType.STATIC,
                'correct type' );
        equal( bodyDefinition.get_linearDamping(), 10, 
                'correct linear damping' );
        equal( bodyDefinition.get_angularDamping(), 20, 
                'correct angular damping' );
        equal( bodyDefinition.get_fixedRotation(), 1, 
                'correct fixed rotation' );
        equal( bodyDefinition.get_angularVelocity(), 10, 
                'correct angular velocity' );
    });
    
    test( 'default & all params to fixture construction', function() {
      expect(3);
      
      var box = engine.physics.resource.Box( 1, 1 );  

      var fixtureDef;
      try {
        fixtureDef = engine.physics.resource.FixtureDefinition();
      } catch (e) {
        ok(true, "Creating FixtureDefinition without params throws");
      }
      
      fixtureDef = engine.physics.resource.FixtureDefinition({
        shape: box,
        density: 20
      });
      equal(fixtureDef.get_shape(), box.ptr, "fixture has correct shape");
      equal(fixtureDef.get_density(), 20, "density is correct");

    });

    
    test( 'construct a body', function() {
        expect( 5 );
        
        var bodyDefinition = engine.physics.resource.BodyDefinition({
                type: engine.physics.resource.BodyDefinition.bodyType.DYNAMIC
        });        
        ok( bodyDefinition, 'body definition is returned' );
        
        var box = engine.physics.resource.Box( 1, 1 );        
        ok( box, 'box is returned' );
        
        var fixtureDefinition = engine.physics.resource.FixtureDefinition({ 
            shape: box
        });
        ok( fixtureDefinition, 'fixture definition is returned' );
        
        var body = new engine.physics.component.Body({
            bodyDefinition: bodyDefinition,
            fixtureDefinition: fixtureDefinition
        });
        ok( body, 'body is returned' );
        
        var space = new engine.core.Space();        
        var entity = new space.Entity({
            components: [
                         new engine.core.component.Transform(),
                         body
                         ]
        });
        equal( body, entity.find( 'Body' ), 'body is added to the entity' );
    });
    
    test( 'construct a body, no fixture definition', function() {
        expect( 3 );
        
        var bodyDefinition = engine.physics.resource.BodyDefinition({
                type: engine.physics.resource.BodyDefinition.bodyType.DYNAMIC
        });        
        ok( bodyDefinition, 'body definition is returned' );
              
        var body = new engine.physics.component.Body({
            bodyDefinition: bodyDefinition
        });
        ok( body, 'body is returned' );
        
        var space = new engine.core.Space();        
        var entity = new space.Entity({
            components: [
                         new engine.core.component.Transform(),
                         body
                         ]
        });
        equal( body, entity.find( 'Body' ), 'body is added to the entity' );
    });
    
    test( 'construct a body, no body definition', function() {
        expect( 1 );
                     
        try {
            var body = new engine.physics.component.Body();
        } catch( e ) {
            equal( e, 'missing body definition', 'exception raised' );
        }
    });
    
    test( 'body has default event handlers', function() {
        expect( 3 );
        
        var bodyDefinition = engine.physics.resource.BodyDefinition();        
                  
        var body = new engine.physics.component.Body({
            bodyDefinition: bodyDefinition
        });
        
        ok( body.onAngularImpulse, 'onAngularImpulse handler is defined' );
        ok( body.onLinearImpulse, 'onLinearImpulse handler is defined' );
        ok( body.onUpdate, 'onUpdate handler is defined' );
    });
    
    test( 'body definition, defaults for unspecified parameters', function() {
        expect( 5 );
                     
        var bodyDefinition = engine.physics.resource.BodyDefinition({
            type: engine.physics.resource.BodyDefinition.bodyType.DYNAMIC
        });        
        equal( bodyDefinition.get_type(), engine.physics.resource.BodyDefinition.bodyType.DYNAMIC,
                'default type is correct');
        equal( bodyDefinition.get_linearDamping(), 0, 'defualt linear damping is correct' );
        equal( bodyDefinition.get_angularDamping(), 0, 'default angular damping is correct' );
        equal( bodyDefinition.get_fixedRotation(), 0, 'default fixed rotation is correct' );
        equal( bodyDefinition.get_angularVelocity(), 0, 
               'default angular velocity' );
    });
    
    test( 'body active property', 
      function () {
        expect(2);
        
        var bodyDef = engine.physics.resource.BodyDefinition();
        var bodyComponent = new engine.physics.component.Body({
          bodyDefinition: bodyDef
        });

        var transform = new engine.core.component.Transform({
          position: [1, 2, 3],
          rotation: [4, 5, 6]
        });
                      
        var entity = new engine.core.Entity();
        entity.add(transform);
        entity.add(bodyComponent);

        ok(bodyComponent.active,
          "body component active after add to entity");
        bodyComponent.active = false;
        ok(bodyComponent.active === false, 
          "body component active setter works");
      });
    
    test( 'onAngularImpulse updates Box2D body', function() {
        expect(1);
        
        var bodyDef = engine.physics.resource.BodyDefinition();
        var body = new engine.physics.component.Body({
          bodyDefinition: bodyDef
        });

        var transform = new engine.core.component.Transform({
          position: [1, 2, 3],
          rotation: [4, 5, 6]
        });
                
        // put in a mock
        var mock = this.mock(body._b2Body);
        body._b2Body = mock;
        mock.expects( 'ApplyAngularImpulse' ).once();
        
        new engine.core.Event({
            type: 'AngularImpulse',
            queue: false,
            data: {
                impulse: 1
            }
        }).dispatch( body );
        
        try {
            ok( mock.verify(), 'ApplyAngularImpulse invoked' );
        } catch( e ) {}
    });
    
    test( 'onLinearImpulse updates Box2D body', function() {
        expect(1);
        
        var bodyDef = engine.physics.resource.BodyDefinition();
        var body = new engine.physics.component.Body({
          bodyDefinition: bodyDef
        });

        var transform = new engine.core.component.Transform({
          position: [1, 2, 3],
          rotation: [4, 5, 6]
        });
                
        // put in a mock
        var mock = this.mock(body._b2Body);
        body._b2Body = mock;
        mock.expects( 'ApplyLinearImpulse' ).once();       
        
        new engine.core.Event({
            type: 'LinearImpulse',
            queue: false,
            data:{
                impulse: [1, 1]
            }
        }).dispatch( body );
        
        try{
            ok( mock.verify(), 'ApplyLinearImpulse invoked' );
        } catch( e ) {}
    });
    
    /** TD: event handler tests to write
     * - body.onCompOwnerChgd does appropriate stuff
     * - body.onEntityMgrChgd does appropriate stuff
     * - service.update dispatches event to components (same one ok?); steps simulation
     */
    
    /* TD: integration tests to write; these belong as part of an integration
     * test suite.
     * 
     * - contact events are generated for begin and end
     * - transform is updated when physics moves the body
     *     - verify new position and rotation
     * - test different gravity
     */

}());